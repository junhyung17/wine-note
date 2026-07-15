from django.urls import path
from . import views

app_name = 'wines'

urlpatterns = [
    path('wines/', views.WineNoteListCreateView.as_view(), name='wine-list'),
    path('wines/<int:pk>/', views.WineNoteDetailView.as_view(), name='wine-detail'),
    path('wines/catalog/', views.WineCatalogSearchView.as_view(), name='wine-catalog'),
]
