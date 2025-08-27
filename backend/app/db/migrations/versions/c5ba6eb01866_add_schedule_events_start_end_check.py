"""Add schedule_events start<end check

Revision ID: c5ba6eb01866
Revises: af88e69ec11d
Create Date: 2025-08-17 00:55:00.111076+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c5ba6eb01866'
down_revision: Union[str, Sequence[str], None] = 'af88e69ec11d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_check_constraint(
        "ck_schedule_events_time_order",
        "schedule_events",
        "start_at < end_at",
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_schedule_events_time_order",
        "schedule_events",
        type_="check",
    )
