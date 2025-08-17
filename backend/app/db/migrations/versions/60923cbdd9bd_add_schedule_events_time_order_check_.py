"""Add schedule_events time-order check and index

Revision ID: 60923cbdd9bd
Revises: b4c415d6f1da
Create Date: 2025-08-17 00:31:16.050067+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '60923cbdd9bd'
down_revision: Union[str, Sequence[str], None] = 'b4c415d6f1da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
