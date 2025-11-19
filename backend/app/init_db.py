"""
Initialize database with default data
Run this script after creating the database to populate it with initial data
"""
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import User, Branch, Account, UserRole, AccountType
from app.utils.security import get_password_hash, generate_account_number


def init_db():
    """Initialize database with default data."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if data already exists
        existing_branches = db.query(Branch).count()
        if existing_branches > 0:
            print("Database already initialized. Skipping...")
            return

        print("Creating branches...")

        # Create branches
        branches = [
            Branch(
                name="Main Branch",
                code="MAIN-001",
                referral_code="MAIN001-REF",
                leverage=100,
                commission_per_lot=5.0,
                admin_email="admin@imtiaz.com",
                admin_name="Main Branch Admin",
                status="active",
                is_active=True
            ),
            Branch(
                name="Downtown Branch",
                code="DT-002",
                referral_code="DT002-REF",
                leverage=100,
                commission_per_lot=5.0,
                admin_email="downtown@imtiaz.com",
                admin_name="Downtown Admin",
                status="active",
                is_active=True
            ),
            Branch(
                name="West Branch",
                code="WEST-003",
                referral_code="WEST003-REF",
                leverage=100,
                commission_per_lot=5.0,
                admin_email="west@imtiaz.com",
                admin_name="West Admin",
                status="active",
                is_active=True
            ),
        ]

        for branch in branches:
            db.add(branch)

        db.commit()
        print(f"✓ Created {len(branches)} branches")

        # Refresh branches to get IDs
        for branch in branches:
            db.refresh(branch)

        print("Creating demo users...")

        # Create Manager user
        manager = User(
            email="manager@imtiaz.com",
            hashed_password=get_password_hash("manager123"),
            name="Manager User",
            role=UserRole.MANAGER,
            is_active=True,
            is_verified=True
        )
        db.add(manager)

        # Create Admin user for Main Branch
        admin = User(
            email="admin@imtiaz.com",
            hashed_password=get_password_hash("admin123"),
            name="Admin User",
            role=UserRole.ADMIN,
            branch_id=branches[0].id,
            is_active=True,
            is_verified=True
        )
        db.add(admin)

        # Create Standard Client
        standard_client_account_number = generate_account_number()
        standard_client = User(
            email="client@example.com",
            hashed_password=get_password_hash("client123"),
            name="John Smith",
            phone="+1234567890",
            role=UserRole.CLIENT,
            account_type=AccountType.STANDARD,
            account_number=standard_client_account_number,
            branch_id=branches[0].id,
            referral_code="MAIN001-REF",
            is_active=True,
            is_verified=True
        )
        db.add(standard_client)

        # Create Business Client
        business_client_account_number = generate_account_number()
        business_client = User(
            email="business@example.com",
            hashed_password=get_password_hash("business123"),
            name="Tech Corp",
            phone="+1234567891",
            role=UserRole.CLIENT,
            account_type=AccountType.BUSINESS,
            account_number=business_client_account_number,
            branch_id=branches[0].id,
            referral_code="MAIN001-REF",
            is_active=True,
            is_verified=True
        )
        db.add(business_client)

        db.commit()
        print("✓ Created 4 demo users (Manager, Admin, 2 Clients)")

        # Refresh users to get IDs
        db.refresh(standard_client)
        db.refresh(business_client)

        print("Creating accounts for clients...")

        # Create account for standard client
        standard_account = Account(
            user_id=standard_client.id,
            account_number=standard_client_account_number,
            balance=5000.0,  # Demo balance
            wallet_balance=5000.0,
            trading_balance=0.0,
            leverage=100
        )
        db.add(standard_account)

        # Create account for business client
        business_account = Account(
            user_id=business_client.id,
            account_number=business_client_account_number,
            balance=10000.0,  # Demo balance
            wallet_balance=10000.0,
            trading_balance=0.0,
            leverage=200
        )
        db.add(business_account)

        db.commit()
        print("✓ Created 2 accounts with demo balances")

        print("\n" + "="*60)
        print("✅ Database initialized successfully!")
        print("="*60)
        print("\n📋 Demo Login Credentials:\n")
        print("Manager:")
        print("  Email: manager@imtiaz.com")
        print("  Password: manager123\n")
        print("Admin:")
        print("  Email: admin@imtiaz.com")
        print("  Password: admin123\n")
        print("Standard Client:")
        print("  Email: client@example.com")
        print("  Password: client123")
        print(f"  Account: {standard_client_account_number}")
        print("  Balance: $5,000\n")
        print("Business Client:")
        print("  Email: business@example.com")
        print("  Password: business123")
        print(f"  Account: {business_client_account_number}")
        print("  Balance: $10,000\n")
        print("🏢 Branch Referral Codes:")
        print("  MAIN001-REF - Main Branch")
        print("  DT002-REF - Downtown Branch")
        print("  WEST003-REF - West Branch\n")
        print("="*60)

    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Initializing Imtiaz Trading Platform Database...\n")
    init_db()
