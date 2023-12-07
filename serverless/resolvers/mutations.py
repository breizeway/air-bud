from ariadne import MutationType
from data import ClientErrorCodes, ClientError
from resources.edge import LeagueAuth, EdgeStore
import requests


mutation = MutationType()


@mutation.field("setLeagueAuth")
def resolve_set_league_auth(*_, league_auth):
    try:
        result: requests.Response = EdgeStore().set_league_auth(
            LeagueAuth(**league_auth))
        if (result.ok):
            # TODO: make this result type a class for use with all api responses
            return {"success": result.ok, "errors": []}
        else:
            return {"success": False, "errors": [ClientError(ClientErrorCodes.EDGE_API, f'{result.status_code}: {result.reason}')]}

    except Exception as err:
        print("ERROR - resolve_set_league_auth:", str(err))
        return {"success": False, "errors": [ClientError(ClientErrorCodes.EDGE_API, err)]}
