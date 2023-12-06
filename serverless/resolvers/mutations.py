from ariadne import MutationType
from data import ClientErrorCodes, ClientError
import requests
import json
import os


mutation = MutationType()


@mutation.field("setLeagueAuth")
def resolve_set_league_auth(*_, league_auth):
    try:
        result: requests.Response = requests.patch(url=f'https://api.vercel.com/v1/edge-config/{os.environ["EDGE_CONFIG_ID"]}/items',
                                                   headers={"Content-Type": "application/json",
                                                            "Authorization": f'Bearer {os.environ["VERCEL_API_TOKEN"]}'},
                                                   data=json.dumps({"items": [{
                                                       "operation": "update",
                                                       "key": "league_auth",
                                                       "value": league_auth}]}))
        print("edge_api_result: ", result.json())
        if (result.ok):
            # TODO: make this result type a class for use with all api responses
            return {"success": result.ok, "errors": []}
        else:
            return {"success": False, "errors": [ClientError(ClientErrorCodes.EDGE_API, f'{result.status_code}: {result.reason}')]}

    except Exception as err:
        print("edge_api_error: ", str(err))
        return {"success": False, "errors": [ClientError(ClientErrorCodes.EDGE_API, err)]}
