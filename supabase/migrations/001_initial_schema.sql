-- Imtiaz Trading Platform - Supabase Database Schema
-- Run this SQL in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. LIQUIDITY PROVIDERS TABLE
-- =====================================================
CREATE TABLE liquidity_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    api_type VARCHAR(50) NOT NULL, -- 'MT5', 'MT4', 'REST', 'WebSocket', 'FIX', 'REST+WebSocket'

    -- MT4/MT5 specific fields
    login VARCHAR(255),
    password VARCHAR(255),
    server VARCHAR(255),

    -- REST API specific fields
    api_key TEXT,
    api_secret TEXT,
    base_url TEXT,

    -- WebSocket specific fields
    websocket_url TEXT,

    -- FIX API specific fields
    fix_host VARCHAR(255),
    fix_port INTEGER,
    sender_comp_id VARCHAR(255),
    target_comp_id VARCHAR(255),

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. TRADING ACCOUNTS TABLE
-- =====================================================
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lp_id UUID REFERENCES liquidity_providers(id) ON DELETE SET NULL,

    account_number VARCHAR(255) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- 'DEMO', 'LIVE'
    currency VARCHAR(10) DEFAULT 'USD',

    balance DECIMAL(20, 2) DEFAULT 0.00,
    equity DECIMAL(20, 2) DEFAULT 0.00,
    margin DECIMAL(20, 2) DEFAULT 0.00,
    free_margin DECIMAL(20, 2) DEFAULT 0.00,
    margin_level DECIMAL(10, 2) DEFAULT 0.00,

    leverage INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, account_number)
);

-- =====================================================
-- 3. TRADES TABLE
-- =====================================================
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    ticket_number VARCHAR(255) NOT NULL,
    symbol VARCHAR(50) NOT NULL, -- 'EURUSD', 'GBPUSD', etc.
    trade_type VARCHAR(10) NOT NULL, -- 'BUY', 'SELL'

    volume DECIMAL(20, 4) NOT NULL, -- Lot size
    open_price DECIMAL(20, 5) NOT NULL,
    close_price DECIMAL(20, 5),

    stop_loss DECIMAL(20, 5),
    take_profit DECIMAL(20, 5),

    open_time TIMESTAMP WITH TIME ZONE NOT NULL,
    close_time TIMESTAMP WITH TIME ZONE,

    profit DECIMAL(20, 2) DEFAULT 0.00,
    commission DECIMAL(20, 2) DEFAULT 0.00,
    swap DECIMAL(20, 2) DEFAULT 0.00,

    status VARCHAR(20) DEFAULT 'OPEN', -- 'OPEN', 'CLOSED', 'CANCELLED'
    comment TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(account_id, ticket_number)
);

-- =====================================================
-- 4. TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    transaction_type VARCHAR(50) NOT NULL, -- 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PROFIT', 'LOSS', 'COMMISSION', 'SWAP'
    amount DECIMAL(20, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',

    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'

    reference_id VARCHAR(255), -- External transaction ID
    description TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. ACCOUNT BALANCES HISTORY TABLE
-- =====================================================
CREATE TABLE balance_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,

    balance DECIMAL(20, 2) NOT NULL,
    equity DECIMAL(20, 2) NOT NULL,
    margin DECIMAL(20, 2) NOT NULL,
    free_margin DECIMAL(20, 2) NOT NULL,
    margin_level DECIMAL(10, 2) NOT NULL,

    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Liquidity Providers indexes
CREATE INDEX idx_lp_user_id ON liquidity_providers(user_id);
CREATE INDEX idx_lp_active ON liquidity_providers(is_active);

-- Accounts indexes
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_lp_id ON accounts(lp_id);
CREATE INDEX idx_accounts_active ON accounts(is_active);

-- Trades indexes
CREATE INDEX idx_trades_account_id ON trades(account_id);
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_status ON trades(status);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_open_time ON trades(open_time);

-- Transactions indexes
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_created ON transactions(created_at);

-- Balance history indexes
CREATE INDEX idx_balance_history_account_id ON balance_history(account_id);
CREATE INDEX idx_balance_history_recorded ON balance_history(recorded_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE liquidity_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_history ENABLE ROW LEVEL SECURITY;

-- Liquidity Providers policies
CREATE POLICY "Users can view their own LPs"
    ON liquidity_providers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own LPs"
    ON liquidity_providers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own LPs"
    ON liquidity_providers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own LPs"
    ON liquidity_providers FOR DELETE
    USING (auth.uid() = user_id);

-- Accounts policies
CREATE POLICY "Users can view their own accounts"
    ON accounts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
    ON accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
    ON accounts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
    ON accounts FOR DELETE
    USING (auth.uid() = user_id);

-- Trades policies
CREATE POLICY "Users can view their own trades"
    ON trades FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades"
    ON trades FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades"
    ON trades FOR UPDATE
    USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Balance history policies
CREATE POLICY "Users can view their account balance history"
    ON balance_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM accounts
            WHERE accounts.id = balance_history.account_id
            AND accounts.user_id = auth.uid()
        )
    );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_lp_updated_at BEFORE UPDATE ON liquidity_providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trades_updated_at BEFORE UPDATE ON trades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DEMO DATA (Optional - for testing)
-- =====================================================

-- You can uncomment this to insert demo data after creating a user
/*
-- Insert demo LP (replace 'YOUR_USER_ID' with actual user ID)
INSERT INTO liquidity_providers (user_id, name, api_type, login, password, server)
VALUES (
    'YOUR_USER_ID',
    'Demo MT5 Broker',
    'MT5',
    '12345678',
    'demo_password',
    'demo.server.com'
);

-- Insert demo account
INSERT INTO accounts (user_id, lp_id, account_number, account_name, account_type, balance, equity)
VALUES (
    'YOUR_USER_ID',
    (SELECT id FROM liquidity_providers WHERE name = 'Demo MT5 Broker' LIMIT 1),
    'ACC-001',
    'My Demo Account',
    'DEMO',
    10000.00,
    10000.00
);
*/
