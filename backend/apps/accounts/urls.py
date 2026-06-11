from django.urls import path
from .views import CurrentUserView, GoogleLoginView, LogoutView

urlpatterns = [
    path('google/', GoogleLoginView.as_view(), name='google-login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]
