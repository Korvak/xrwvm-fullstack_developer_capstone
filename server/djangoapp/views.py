# Uncomment the required imports before adding the code

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate, logout
import logging
import json
import requests
from django.views.decorators.csrf import csrf_exempt

from .populate import initiate

# model import
from .models import CarMake, CarModel


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

# Create a `logout_request` view to handle sign out request


def logout_request(request):
    if request.user.is_authenticated:
        data = {"username": request.user.username}
        logout(request)
        return JsonResponse(data)
    else:
        return JsonResponse(
            {
                "error": "user is not logged in"
            }
        )

# Create a `registration` view to handle sign up request
# @csrf_exempt


@csrf_exempt
def register(request):
    context = {}
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    username_exist = False
    email_exist = False
    try:
        # Check if user already exists
        User.objects.get(username=username)
        username_exist = True
    except Exception as e:
        # If not, simply log this is a new user
        logger.debug("{} is new user".format(username))
    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(
            username=username, first_name=first_name, last_name=last_name, password=password, email=email)
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...


def get_dealers(request):
    db_url = f'http://127.0.0.1:{3030}/fetchDealers'
    response = requests.get(db_url)
    if (response.status_code != 200):
        return HttpResponse(status=500)
    dealers = []
    for jsonObj in response.json():
        dealers.append(
            {
                "id": jsonObj["id"],
                "short_name": jsonObj["short_name"],
                "full_name": jsonObj["full_name"],
                "city": jsonObj["city"],
                "state": jsonObj["state"],
                "address": jsonObj["address"],
                "zip": jsonObj["zip"]
            }
        )
    return JsonResponse({"dealers": dealers})


# Create a `get_dealer_reviews` view to render the reviews of a dealer
def get_dealer_reviews(request, dealer_id):
    db_url = f'http://127.0.0.1:{3030}/fetchReviews/dealer/{dealer_id}'
    response = requests.get(db_url)
    if (response.status_code != 200):
        return HttpResponse(status=500)
    print(response.json())
    result = response.json()
    return JsonResponse({"reviews": result})


# Create a `get_dealer_details` view to render the dealer details
def get_dealer_details(request, dealer_id):
    db_url = f'http://127.0.0.1:{3030}/fetchDealer/{dealer_id}'
    response = requests.get(db_url)
    if (response.status_code != 200):
        return HttpResponse(status=500)
    result = response.json()[0]
    return JsonResponse({"dealer": result})

# Create a `add_review` view to submit a review


def add_review(request):
    try:
        db_url = f'http://127.0.0.1:{3030}/insert_review'
        requests.post(db_url, json=request.body)
        return JsonResponse({"status": 200})
    except:
        return JsonResponse({"status": 500})


def get_cars(request):
    count = CarMake.objects.filter().count()
    print(count)
    if (count == 0):
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({"CarModel": car_model.name,
                    "CarMake": car_model.car_make.name})
    return JsonResponse({"CarModels": cars})
