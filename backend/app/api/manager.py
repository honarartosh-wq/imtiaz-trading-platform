from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.manager import (
    ProductSpreadCreate,
    ProductSpreadUpdate,
    ProductSpreadResponse,
    BranchCommissionUpdate,
    BranchResponse,
    LiquidityProviderCreate,
    LiquidityProviderUpdate,
    LiquidityProviderResponse,
    RoutingRuleCreate,
    RoutingRuleUpdate,
    RoutingRuleResponse
)
from app.models.product_spread import ProductSpread
from app.models.branch import Branch
from app.models.user import User, UserRole
from app.models.liquidity_provider import LiquidityProvider
from app.models.routing_rule import RoutingRule
from app.middleware.auth import get_current_user
from app.utils.logging import get_logger

logger = get_logger(__name__)

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

    try:
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

        logger.info(f"Product spread created for {new_spread.symbol} by manager {current_user.email}")
        return new_spread

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create spread for {spread_data.symbol}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create product spread. Please try again later."
        )


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

    try:
        # Update fields if provided
        if spread_data.extra_spread is not None:
            spread.extra_spread = spread_data.extra_spread
        if spread_data.base_spread is not None:
            spread.base_spread = spread_data.base_spread
        if spread_data.is_active is not None:
            spread.is_active = spread_data.is_active

        db.commit()
        db.refresh(spread)

        logger.info(f"Product spread updated for {spread.symbol} by manager {current_user.email}")
        return spread

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update spread for {symbol}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update product spread. Please try again later."
        )


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

    try:
        db.delete(spread)
        db.commit()

        logger.info(f"Product spread deleted for {symbol} by manager {current_user.email}")
        return None

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete spread for {symbol}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete product spread. Please try again later."
        )


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

    try:
        # Update commission
        branch.commission_per_lot = commission_data.commission_per_lot

        db.commit()
        db.refresh(branch)

        logger.info(f"Branch commission updated for branch {branch_id} by manager {current_user.email}")
        return branch

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update commission for branch {branch_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update branch commission. Please try again later."
        )


# ==================== Liquidity Provider Endpoints ====================

@router.get("/liquidity-providers", response_model=List[LiquidityProviderResponse])
async def get_all_liquidity_providers(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Get all liquidity providers (manager only)."""
    lps = db.query(LiquidityProvider).all()
    return lps


@router.get("/liquidity-providers/{lp_id}", response_model=LiquidityProviderResponse)
async def get_liquidity_provider(
    lp_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Get a specific liquidity provider (manager only)."""
    lp = db.query(LiquidityProvider).filter(LiquidityProvider.id == lp_id).first()
    if not lp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Liquidity provider with ID {lp_id} not found"
        )
    return lp


@router.post("/liquidity-providers", response_model=LiquidityProviderResponse, status_code=status.HTTP_201_CREATED)
async def create_liquidity_provider(
    lp_data: LiquidityProviderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Create a new liquidity provider (manager only)."""

    # Check if LP with same code already exists
    existing_lp = db.query(LiquidityProvider).filter(
        LiquidityProvider.code == lp_data.code
    ).first()

    if existing_lp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Liquidity provider with code {lp_data.code} already exists"
        )

    try:
        new_lp = LiquidityProvider(**lp_data.dict())
        db.add(new_lp)
        db.commit()
        db.refresh(new_lp)

        logger.info(f"Liquidity provider {new_lp.name} created by manager {current_user.email}")
        return new_lp

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create liquidity provider: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create liquidity provider. Please try again later."
        )


@router.put("/liquidity-providers/{lp_id}", response_model=LiquidityProviderResponse)
async def update_liquidity_provider(
    lp_id: int,
    lp_data: LiquidityProviderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Update a liquidity provider (manager only)."""

    lp = db.query(LiquidityProvider).filter(LiquidityProvider.id == lp_id).first()
    if not lp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Liquidity provider with ID {lp_id} not found"
        )

    try:
        update_data = lp_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(lp, key, value)

        db.commit()
        db.refresh(lp)

        logger.info(f"Liquidity provider {lp.name} updated by manager {current_user.email}")
        return lp

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update liquidity provider {lp_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update liquidity provider. Please try again later."
        )


@router.delete("/liquidity-providers/{lp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_liquidity_provider(
    lp_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Delete a liquidity provider (manager only)."""

    lp = db.query(LiquidityProvider).filter(LiquidityProvider.id == lp_id).first()
    if not lp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Liquidity provider with ID {lp_id} not found"
        )

    try:
        db.delete(lp)
        db.commit()

        logger.info(f"Liquidity provider {lp.name} deleted by manager {current_user.email}")
        return None

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete liquidity provider {lp_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete liquidity provider. Please try again later."
        )


# ==================== Routing Rule Endpoints ====================

@router.get("/routing-rules", response_model=List[RoutingRuleResponse])
async def get_all_routing_rules(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Get all routing rules (manager only)."""
    rules = db.query(RoutingRule).order_by(RoutingRule.priority).all()
    return rules


@router.get("/routing-rules/{rule_id}", response_model=RoutingRuleResponse)
async def get_routing_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Get a specific routing rule (manager only)."""
    rule = db.query(RoutingRule).filter(RoutingRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Routing rule with ID {rule_id} not found"
        )
    return rule


@router.post("/routing-rules", response_model=RoutingRuleResponse, status_code=status.HTTP_201_CREATED)
async def create_routing_rule(
    rule_data: RoutingRuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Create a new routing rule (manager only)."""

    try:
        new_rule = RoutingRule(**rule_data.dict(), created_by=current_user.id)
        db.add(new_rule)
        db.commit()
        db.refresh(new_rule)

        logger.info(f"Routing rule '{new_rule.name}' created by manager {current_user.email}")
        return new_rule

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create routing rule: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create routing rule. Please try again later."
        )


@router.put("/routing-rules/{rule_id}", response_model=RoutingRuleResponse)
async def update_routing_rule(
    rule_id: int,
    rule_data: RoutingRuleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Update a routing rule (manager only)."""

    rule = db.query(RoutingRule).filter(RoutingRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Routing rule with ID {rule_id} not found"
        )

    try:
        update_data = rule_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(rule, key, value)

        db.commit()
        db.refresh(rule)

        logger.info(f"Routing rule '{rule.name}' updated by manager {current_user.email}")
        return rule

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to update routing rule {rule_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update routing rule. Please try again later."
        )


@router.delete("/routing-rules/{rule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_routing_rule(
    rule_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """Delete a routing rule (manager only)."""

    rule = db.query(RoutingRule).filter(RoutingRule.id == rule_id).first()
    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Routing rule with ID {rule_id} not found"
        )

    try:
        db.delete(rule)
        db.commit()

        logger.info(f"Routing rule '{rule.name}' deleted by manager {current_user.email}")
        return None

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete routing rule {rule_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete routing rule. Please try again later."
        )
