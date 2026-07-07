from django.urls import path

from . import views

urlpatterns = [
    path('subjects/', views.SubjectListCreate.as_view(), name='subject-list'),
    path('subjects/<int:pk>/', views.SubjectDetail.as_view(), name='subject-detail'),

    path('courses/', views.CourseListCreate.as_view(), name='course-list'),
    path('courses/<int:pk>/', views.CourseDetail.as_view(), name='course-detail'),

    path('units/', views.UnitListCreate.as_view(), name='unit-list'),
    path('units/<int:pk>/', views.UnitDetail.as_view(), name='unit-detail'),

    path('topics/', views.TopicListCreate.as_view(), name='topic-list'),
    path('topics/<int:pk>/', views.TopicDetail.as_view(), name='topic-detail'),

    path('homeworks/', views.HomeworkListCreate.as_view(), name='homework-list'),
    path('homeworks/<int:pk>/', views.HomeworkDetail.as_view(), name='homework-detail'),

    path('tests/', views.UnitTestListCreate.as_view(), name='unittest-list'),
    path('tests/<int:pk>/', views.UnitTestDetail.as_view(), name='unittest-detail'),
]
