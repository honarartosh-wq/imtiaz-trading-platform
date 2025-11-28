from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.manager import (
    ProductSpreadCreate,
    ProductSpreadUpdate,
    ProductSpreadResponse,
    BranchCommissionUpdate,
    BranchResponse
)
from app.models.product_spread import ProductSpread
from app.models.branch import Branch
from app.models.user import User, UserRole
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/manager", tags=["Manager Operations"])


def require_manager(current_user: User = Depends(get_current_user)):
    """Dependency to ensure user is a manager."""
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can access this endpoint"
        )
    return current_user


# ==================== Product Spreads Endpoints ====================

@router.get("/spreads", response_model=List[ProductSpreadResponse])
async def get_all_spreads(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Get all product spreads (manager only)."""
    spreads = db.query(ProductSpread).all()
    return spreads


@router.get("/spreads/{symbol}", response_model=ProductSpreadResponse)
async def get_spread_by_symbol(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Get spread for a specific product symbol (manager only)."""
    spread = db.query(ProductSpread).filter(ProductSpread.symbol == symbol.upper()).first()
    if not spread:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product spread for {symbol} not found"
        )
    return spread


@router.post("/spreads", response_model=ProductSpreadResponse, status_code=status.HTTP_201_CREATED)
async def create_spread(
    spread_data: ProductSpreadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Create a new product spread (manager only)."""

    # Check if spread already exists for this symbol
    existing_spread = db.query(ProductSpread).filter(
        ProductSpread.symbol == spread_data.symbol.upper()
    ).first()

    if existing_spread:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Spread for {spread_data.symbol} already exists"
        )

    # Create new spread
    new_spread = ProductSpread(
        symbol=spread_data.symbol.upper(),
        name=spread_data.name,
        base_spread=spread_data.base_spread,
        extra_spread=spread_data.extra_spread,
        category=spread_data.category,
        is_active=spread_data.is_active
    )

    db.add(new_spread)
    db.commit()
    db.refresh(new_spread)

    return new_spread


@router.put("/spreads/{symbol}", response_model=ProductSpreadResponse)
async def update_spread(
    symbol: str,
    spread_data: ProductSpreadUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Update product spread (manager only)."""

    spread = db.query(ProductSpread).filter(ProductSpread.symbol == symbol.upper()).first()
    if not spread:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product spread for {symbol} not found"
        )

    # Update fields if provided
    if spread_data.extra_spread is not None:
        spread.extra_spread = spread_data.extra_spread
    if spread_data.base_spread is not None:
        spread.base_spread = spread_data.base_spread
    if spread_data.is_active is not None:
        spread.is_active = spread_data.is_active

    db.commit()
    db.refresh(spread)

    return spread


@router.delete("/spreads/{symbol}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_spread(
    symbol: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Delete a product spread (manager only)."""

    spread = db.query(ProductSpread).filter(ProductSpread.symbol == symbol.upper()).first()
    if not spread:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product spread for {symbol} not found"
        )

    db.delete(spread)
    db.commit()

    return None


# ==================== Branch Commissions Endpoints ====================

@router.get("/branches", response_model=List[BranchResponse])
async def get_all_branches(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Get all branches with their commissions (manager only)."""
    branches = db.query(Branch).all()
    return branches


@router.get("/branches/{branch_id}", response_model=BranchResponse)
async def get_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Get a specific branch (manager only)."""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Branch with ID {branch_id} not found"
        )
    return branch


@router.put("/branches/{branch_id}/commission", response_model=BranchResponse)
async def update_branch_commission(
    branch_id: int,
    commission_data: BranchCommissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Update commission for a specific branch (manager only)."""

    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Branch with ID {branch_id} not found"
        )

    # Update commission
    branch.commission_per_lot = commission_data.commission_per_lot

    db.commit()
    db.refresh(branch)

    return branch
