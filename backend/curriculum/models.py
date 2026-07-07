"""Curriculum content tree.

The hierarchy is Subject → Course → Unit → Topic, each level a plain
one-to-many child of the one above. Graded work attaches at the level whose
scope it matches — the ForeignKey target *is* the scope declaration:

    Homework  → Topic   (a fact about one topic in one unit)
    UnitTest  → Unit    (a fact about the whole unit)

If a course-wide final is ever added, it follows the same rule: CourseTest → Course.

A Topic belongs to exactly one Unit. If the same concept is taught in two
units, it is two Topic rows for now. Should topics ever need to be *reused*
across units, this FK becomes a ManyToManyField(Unit, through=...) — a small,
well-trodden migration — but that flexibility is deferred until it is real.
"""
from django.db import models


class Subject(models.Model):
    """Top-level discipline, e.g. "Math"."""

    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Course(models.Model):
    """A course within a subject, e.g. "Trigonometry"."""

    subject = models.ForeignKey(
        Subject, related_name="courses", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Unit(models.Model):
    """A unit within a course, e.g. "Right triangles"."""

    course = models.ForeignKey(
        Course, related_name="units", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Topic(models.Model):
    """Leaf content within a unit, e.g. "Pythagorean theorem"."""

    unit = models.ForeignKey(
        Unit, related_name="topics", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Homework(models.Model):
    """Graded work scoped to a single topic."""

    topic = models.ForeignKey(
        Topic, related_name="homeworks", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class UnitTest(models.Model):
    """End-of-unit assessment, scoped to the whole unit.

    Attaches to Unit rather than any single topic because it spans every
    topic in the unit and belongs to no one of them.
    """

    unit = models.ForeignKey(
        Unit, related_name="tests", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title
