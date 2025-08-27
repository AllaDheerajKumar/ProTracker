"""Add schedule_events time-order check and index

Revision ID: b4c415d6f1da
Revises: 0425fde84db9
Create Date: 2025-08-17 00:21:04.261682+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b4c415d6f1da'
down_revision: Union[str, Sequence[str], None] = '0425fde84db9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
