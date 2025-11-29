"""
Logging configuration for the trading platform.
Provides structured logging for security events, transactions, and system operations.
"""
import logging
import sys
from datetime import datetime
from typing import Optional


# Configure logging format
LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
DATE_FORMAT = '%Y-%m-%d %H:%M:%S'


def setup_logging(log_level: str = "INFO") -> None:
    """
    Setup application-wide logging configuration.

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format=LOG_FORMAT,
        datefmt=DATE_FORMAT,
        handlers=[
            logging.StreamHandler(sys.stdout),
            # Add file handler in production
            # logging.FileHandler('app.log'),
        ]
    )


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module.

    Args:
        name: Logger name (usually __name__)

    Returns:
        Configured logger instance
    """
    return logging.getLogger(name)


# Security event logger
security_logger = logging.getLogger("security")
security_logger.setLevel(logging.INFO)


# Transaction logger
transaction_logger = logging.getLogger("transactions")
transaction_logger.setLevel(logging.INFO)


# API logger
api_logger = logging.getLogger("api")
api_logger.setLevel(logging.INFO)


def log_security_event(
    event_type: str,
    user_email: Optional[str] = None,
    user_id: Optional[int] = None,
    success: bool = True,
    details: Optional[str] = None
) -> None:
    """
    Log security-related events.

    Args:
        event_type: Type of security event (login, logout, registration, etc.)
        user_email: User's email address
        user_id: User's ID
        success: Whether the event was successful
        details: Additional details about the event
    """
    status = "SUCCESS" if success else "FAILED"
    message = f"{event_type.upper()} - {status}"

    if user_email:
        message += f" - User: {user_email}"
    if user_id:
        message += f" - ID: {user_id}"
    if details:
        message += f" - Details: {details}"

    if success:
        security_logger.info(message)
    else:
        security_logger.warning(message)


def log_transaction(
    transaction_type: str,
    user_id: int,
    amount: float,
    transaction_id: Optional[int] = None,
    status: str = "completed",
    details: Optional[str] = None
) -> None:
    """
    Log financial transactions.

    Args:
        transaction_type: Type of transaction (deposit, withdrawal, trade, etc.)
        user_id: User's ID
        amount: Transaction amount
        transaction_id: Transaction ID
        status: Transaction status
        details: Additional details
    """
    message = f"TRANSACTION - {transaction_type.upper()} - User ID: {user_id} - Amount: {amount} - Status: {status}"

    if transaction_id:
        message += f" - TX ID: {transaction_id}"
    if details:
        message += f" - Details: {details}"

    transaction_logger.info(message)


def log_api_request(
    endpoint: str,
    method: str,
    user_id: Optional[int] = None,
    status_code: int = 200,
    details: Optional[str] = None
) -> None:
    """
    Log API requests.

    Args:
        endpoint: API endpoint
        method: HTTP method
        user_id: User's ID
        status_code: HTTP status code
        details: Additional details
    """
    message = f"API - {method} {endpoint} - Status: {status_code}"

    if user_id:
        message += f" - User ID: {user_id}"
    if details:
        message += f" - Details: {details}"

    if status_code >= 400:
        api_logger.warning(message)
    else:
        api_logger.info(message)
