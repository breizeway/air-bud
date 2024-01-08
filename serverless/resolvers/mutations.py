from ariadne import MutationType
from resolvers.response import ClientErrorCodes, ClientError
from resources.edge import LeagueAuth, EdgeStore
from resolvers.response import Response
from time import sleep
import requests


mutation = MutationType()


@mutation.field("setLeagueAuth")
def resolve_set_league_auth(*_, league_auth):
    response = Response()

    try:
        result: requests.Response = EdgeStore().set_league_auth(
            LeagueAuth(**league_auth))
        sleep(3)
        if not result.ok:
            response.add_error(ClientError(
                ClientErrorCodes.EDGE_API, f'{result.status_code}: {result.reason}'))
    except Exception as err:
        print("ERROR - resolve_set_league_auth: ", str(err))
        response.add_error(ClientError(ClientErrorCodes.EDGE_API, err))

    return response.resolve()
