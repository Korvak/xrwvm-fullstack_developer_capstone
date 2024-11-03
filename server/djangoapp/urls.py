# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # # path for registration
    path(route='register', view=views.register, name='register'),
    # path for login
    path(route='login', view=views.login_user, name='login'),
    path(route='logout', view=views.logout_request, name='logout'),
    # path for dealer reviews view
    path(route='get_cars', view=views.get_cars, name='getcars'),
    path(route='get_dealers', view=views.get_dealers, name='getdealers'),
    path(route="details/dealer/<int:dealer_id>",
         view=views.get_dealer_details, name='getdealer'),
    path(route="reviews/dealer/<int:dealer_id>",
         view=views.get_dealer_reviews, name='getdealerreviews'),
    path(route="reviews/add_review", view=views.add_review, name='addreview'),
    # path for add a review view

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
