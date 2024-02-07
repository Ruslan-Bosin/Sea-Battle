from . import constants
from django.conf import settings


def conventer(debug_in_str: str) -> bool:
    debug_in_str = debug_in_str.lower()
    if debug_in_str in constants.POSSIBLE_DEBUG_ON_VARIANTS:
        return True
    return False

def get_absolute_url(relative_url: str) -> str:
    return settings.MAIN_URL + relative_url
