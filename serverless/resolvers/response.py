from enum import Enum
from typing import List, Union


class ClientErrorCodes(Enum):
    LEAGUE_API_AUTH = "LEAGUE_API_AUTH"
    LEAGUE_API = "LEAGUE_API"
    EDGE_API = "EDGE_API"


class ClientError:
    def __init__(self, code: ClientErrorCodes, message: str):
        self.code = code.value
        self.message = message

    def serialize(self):
        return {
            "code": self.code,
            "message": self.message
        }


class Response:
    def __init__(self):
        self.errors: List[ClientError] = list()
        self.success: Union[None, bool] = None

    def resolve(self, data: dict = {}):
        return {"success": self.is_success(data), "errors": list(map(lambda error: error.serialize(), self.errors)), **data}

    def add_error(self, error: ClientError):
        self.errors.append(error)

    def is_success(self, data: dict = {}):
        success_is_set = self.success is not None
        errors_exist = len(self.errors)
        data_exists = bool(len(data.values()))
        data_is_not_truthy = not all(bool(val) for val in list(data.values()))
        return self.success if success_is_set else False if errors_exist or (data_exists and data_is_not_truthy) else True
