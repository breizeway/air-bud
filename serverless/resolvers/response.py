from enum import Enum
from typing import List


class ClientErrorCodes(Enum):
    LEAGUE_API_AUTH = "LEAGUE_API_AUTH"
    LEAGUE_API = "LEAGUE_API"
    EDGE_API = "EDGE_API"


class ClientError:
    def __init__(self, code: ClientErrorCodes, message: str):
        self.code = code.value
        self.message = message


class Response:
    def __init__(self):
        self.errors = list()
        self.success = None

    def package(self, data: dict):
        success = self.success if self.success else False if len(
            self.errors) or not len(data.values) else True
        return {"success": success, "errors": self.errors, **data}

    @property
    def success(self):
        return self.success

    @success.setter
    def set_success(self, success: bool):
        self.success = success

    @property
    def errors(self):
        return self.errors

    @errors.setter
    def set_errors(self, errors: List[ClientError]):
        self.errors = errors

    def add_error(self, error: ClientError):
        self.errors.append(error)
