from rest_framework import serializers

from .models import Course, Homework, Subject, Topic, Unit, UnitTest


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ('id', 'title', 'order')


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'subject', 'title', 'order')


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ('id', 'course', 'title', 'order')


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('id', 'unit', 'title', 'order')


class HomeworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = ('id', 'topic', 'title', 'order')


class UnitTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitTest
        fields = ('id', 'unit', 'title', 'order')
