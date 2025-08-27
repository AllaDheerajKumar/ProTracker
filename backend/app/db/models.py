from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum, CheckConstraint, Index
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func
import enum

Base = declarative_base()

class TaskStatus(str, enum.Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    estimated_minutes = Column(Integer)
    due_at = Column(DateTime(timezone=True))
    priority = Column(Integer, default=0)
    status = Column(Enum(TaskStatus), server_default=TaskStatus.TODO.value, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    schedule_events = relationship(
        "ScheduleEvent",
        back_populates="task",
        passive_deletes=True,   # rely on DB ON DELETE CASCADE
    )

class ScheduleEvent(Base):
    __tablename__ = "schedule_events"
    __table_args__ = (
        CheckConstraint('start_at < end_at', name='ck_schedule_events_time_order'),
        Index('ix_schedule_events_task_start', 'task_id', 'start_at'),
    )
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    start_at = Column(DateTime(timezone=True), nullable=False)
    end_at = Column(DateTime(timezone=True), nullable=False)
    source = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    task = relationship("Task", back_populates="schedule_events")
