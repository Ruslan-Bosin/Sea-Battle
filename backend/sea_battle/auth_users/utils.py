from datetime import datetime, timedelta

from django.conf import settings
from pytz import timezone


def get_token_expire() -> datetime:
    """Creates expire time for the activation token."""
    days, time = settings.ACTIVATION_URL_EXPIRE_TIME.split()
    expire = datetime.strptime(time, '%H:%M:%S')
    return datetime.now(tz=timezone(settings.TIME_ZONE)) + timedelta(
        days=int(days),
        hours=expire.hour,
        minutes=expire.minute,
        seconds=expire.second,
    )