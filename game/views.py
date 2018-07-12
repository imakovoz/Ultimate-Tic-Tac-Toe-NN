from __future__ import unicode_literals
from django.http import HttpResponse
from django.http import Http404
from django.template import loader
from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
import json


def index(request):
    return render(request, 'game/game.html')

def choose_move(request):
    print("*** request ***")
    data = request.GET.get('game', None)
    print(json.loads(data)['game'])
    # print(game)
    return JsonResponse({"move": [5, 1]})
