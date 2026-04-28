#![no_std]

use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror, token,
    Address, Env, Symbol,
};

// ─── Error Types ────────────────────────────────────────────────────────────
#[contracterror]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum Error {
    /// The address is already registered.
    AlreadyRegistered = 1,
    /// The caller is not registered.
    NotRegistered = 2,
    /// Token transfer failed (e.g. insufficient balance).
    InsufficientBalance = 3,
}

// ─── Storage Keys ────────────────────────────────────────────────────────────
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Developer(Address),
    Treasury,
}

// ─── Constants ───────────────────────────────────────────────────────────────
/// Registration fee: 10 XLM expressed in stroops (1 XLM = 10_000_000 stroops)
pub const REGISTRATION_FEE: i128 = 10_000_000;

// ─── Contract ────────────────────────────────────────────────────────────────
#[contract]
pub struct ApiRegistry;

#[contractimpl]
impl ApiRegistry {
    /// Initialise the contract with a treasury address that receives fees.
    pub fn init(env: Env, treasury: Address) {
        env.storage().instance().set(&DataKey::Treasury, &treasury);
    }

    /// Register a developer by paying the 10-XLM fee via an inter-contract
    /// token call (Level 4 requirement).
    ///
    /// # Errors
    /// - `AlreadyRegistered` – caller has already registered.
    pub fn register(env: Env, caller: Address, token: Address) -> Result<(), Error> {
        caller.require_auth();

        let key = DataKey::Developer(caller.clone());

        if env.storage().persistent().has(&key) {
            return Err(Error::AlreadyRegistered);
        }

        // ── Level 4: Inter-contract call ──────────────────────────────────
        // Transfer REGISTRATION_FEE stroops from caller to this contract.
        let treasury: Address = env
            .storage()
            .instance()
            .get(&DataKey::Treasury)
            .unwrap_or(env.current_contract_address());

        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&caller, &treasury, &REGISTRATION_FEE);
        // ─────────────────────────────────────────────────────────────────

        env.storage().persistent().set(&key, &true);

        env.events()
            .publish((Symbol::new(&env, "registered"),), caller);

        Ok(())
    }

    /// Returns `true` if the given address is registered.
    pub fn is_registered(env: Env, caller: Address) -> bool {
        env.storage()
            .persistent()
            .has(&DataKey::Developer(caller))
    }

    /// Returns the current registration fee in stroops.
    pub fn get_fee(_env: Env) -> i128 {
        REGISTRATION_FEE
    }
}

// ─── Tests ───────────────────────────────────────────────────────────────────
#[cfg(test)]
mod tests {
    extern crate std;

    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    /// Helper: deploy the contract and return (env, contract_address).
    fn setup() -> (Env, Address) {
        let env = Env::default();
        env.mock_all_auths();
        let id = env.register(ApiRegistry, ());
        (env, id)
    }

    /// Helper: deploy a mock Stellar Asset Contract and return its address plus
    /// an admin client so we can mint tokens in tests.
    fn create_token(env: &Env, admin: &Address) -> Address {
        let sac = env.register_stellar_asset_contract_v2(admin.clone());
        sac.address()
    }

    // ── Test 1: Happy-path registration ─────────────────────────────────────
    #[test]
    fn test_register_new_developer() {
        let (env, contract_id) = setup();
        let client = ApiRegistryClient::new(&env, &contract_id);

        let treasury = Address::generate(&env);
        client.init(&treasury);

        let admin = Address::generate(&env);
        let developer = Address::generate(&env);
        let token_addr = create_token(&env, &admin);

        // Mint enough tokens to pay the fee
        let token_admin = soroban_sdk::token::StellarAssetClient::new(&env, &token_addr);
        token_admin.mint(&developer, &20_000_000i128);

        client.register(&developer, &token_addr);

        assert!(client.is_registered(&developer));
    }

    // ── Test 2: Duplicate registration returns AlreadyRegistered ────────────
    #[test]
    fn test_register_duplicate_fails() {
        let (env, contract_id) = setup();
        let client = ApiRegistryClient::new(&env, &contract_id);

        let treasury = Address::generate(&env);
        client.init(&treasury);

        let admin = Address::generate(&env);
        let developer = Address::generate(&env);
        let token_addr = create_token(&env, &admin);

        let token_admin = soroban_sdk::token::StellarAssetClient::new(&env, &token_addr);
        token_admin.mint(&developer, &30_000_000i128);

        // First call succeeds
        client.register(&developer, &token_addr);

        // Second call must fail with AlreadyRegistered
        let result = client.try_register(&developer, &token_addr);
        assert_eq!(
            result,
            Err(Ok(Error::AlreadyRegistered))
        );
    }

    // ── Test 3: is_registered returns false for unknown address ─────────────
    #[test]
    fn test_is_registered_false_for_unknown() {
        let (env, contract_id) = setup();
        let client = ApiRegistryClient::new(&env, &contract_id);

        let treasury = Address::generate(&env);
        client.init(&treasury);

        let unknown = Address::generate(&env);
        assert!(!client.is_registered(&unknown));
    }

    // ── Test 4: Token transfer deducts exactly REGISTRATION_FEE ─────────────
    #[test]
    fn test_token_transfer_on_register() {
        let (env, contract_id) = setup();
        let client = ApiRegistryClient::new(&env, &contract_id);

        let treasury = Address::generate(&env);
        client.init(&treasury);

        let admin = Address::generate(&env);
        let developer = Address::generate(&env);
        let token_addr = create_token(&env, &admin);

        let token_admin = soroban_sdk::token::StellarAssetClient::new(&env, &token_addr);
        token_admin.mint(&developer, &20_000_000i128);

        let token_client = soroban_sdk::token::Client::new(&env, &token_addr);
        let before = token_client.balance(&developer);

        client.register(&developer, &token_addr);

        let after = token_client.balance(&developer);
        assert_eq!(before - after, REGISTRATION_FEE);
        // Treasury receives the fee
        assert_eq!(token_client.balance(&treasury), REGISTRATION_FEE);
    }
}
