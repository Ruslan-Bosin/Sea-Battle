from django import forms
from .models import Game

class FieldForm(forms.ModelForm):
    class Meta:
        model = Game
        fields = ['size']
