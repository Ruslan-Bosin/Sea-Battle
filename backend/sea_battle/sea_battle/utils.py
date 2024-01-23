from . import constants


def conventer(debug_in_str: str) -> bool:
    debug_in_str = debug_in_str.lower()
    if debug_in_str in constants.POSSIBLE_DEBUG_ON_VARIANTS:
        return True
    return False
