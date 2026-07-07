"""CRUD endpoints for the curriculum tree.

Each model gets two generic views, matching the pattern used across the API:

    ListCreate<Model>          GET  (list)   + POST (create)
    <Model>Detail              GET  (single) + PUT/PATCH (edit) + DELETE

Permissions fall back to the project default (IsAuthenticated).

List endpoints accept an optional parent filter via query string, e.g.
`/api/curriculum/units/?course=3`, so the frontend can fetch one level of the
tree at a time.
"""
from rest_framework import generics

from .models import Course, Homework, Subject, Topic, Unit, UnitTest
from .serializers import (
    CourseSerializer,
    HomeworkSerializer,
    SubjectSerializer,
    TopicSerializer,
    UnitSerializer,
    UnitTestSerializer,
)


class SubjectListCreate(generics.ListCreateAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer


class SubjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer


class CourseListCreate(generics.ListCreateAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = Course.objects.all()
        subject = self.request.query_params.get('subject')
        return qs.filter(subject=subject) if subject else qs


class CourseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class UnitListCreate(generics.ListCreateAPIView):
    serializer_class = UnitSerializer

    def get_queryset(self):
        qs = Unit.objects.all()
        course = self.request.query_params.get('course')
        return qs.filter(course=course) if course else qs


class UnitDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer


class TopicListCreate(generics.ListCreateAPIView):
    serializer_class = TopicSerializer

    def get_queryset(self):
        qs = Topic.objects.all()
        unit = self.request.query_params.get('unit')
        return qs.filter(unit=unit) if unit else qs


class TopicDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer


class HomeworkListCreate(generics.ListCreateAPIView):
    serializer_class = HomeworkSerializer

    def get_queryset(self):
        qs = Homework.objects.all()
        topic = self.request.query_params.get('topic')
        return qs.filter(topic=topic) if topic else qs


class HomeworkDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Homework.objects.all()
    serializer_class = HomeworkSerializer


class UnitTestListCreate(generics.ListCreateAPIView):
    serializer_class = UnitTestSerializer

    def get_queryset(self):
        qs = UnitTest.objects.all()
        unit = self.request.query_params.get('unit')
        return qs.filter(unit=unit) if unit else qs


class UnitTestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UnitTest.objects.all()
    serializer_class = UnitTestSerializer
