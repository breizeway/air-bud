from ariadne import QueryType, graphql_sync, make_executable_schema, load_schema_from_path
from ariadne.explorer import ExplorerGraphiQL
from flask import Flask, jsonify, request
from espn_api.basketball import League

type_defs = load_schema_from_path("api/schema.graphql")

query = QueryType()

@query.field("hello")
def resolve_hello(_, info):
    request = info.context["request"]
    print("REQUEST", request)
    user_agent = request.headers.get("User-Agent", "Guest")
    return "Hello, %s!" % user_agent

@query.field("matchup")
def resolve_matchup(_, info):
    request = info.context["request"]
    league = League(league_id="1659263895",year=2024,espn_s2="AEBkULgGKd5WK77vZ38D88yxOqSO1KyaRtKNNwHxO/VDWwFu7f8CfpHIy84MUJWwi7kwcv6wA0NphH/f2lXwVYH8lEnKzlWet3iYb1ZqbwzClJzwVM6QhRP9bQYIzngfztjasDeDxlM/A+ZVLJR2mrPpcbUm2diqnxvXo7FkHyn6M/Wu0qbVUbcYwUKsOFL3KrgUjLaDcN8406Izy2oqb4RG60IvDRh3X2trqIcTP5U/Q9RUAGGw+NUwc82dgXzG/5JjfshRwc3a5BOaDi2BKBW7",swid="{3872DC0C-8931-4C30-A0FD-F9AD7CA4C739}")
    print("REQUEST", league.members)
    user_agent = request.headers.get("User-Agent", "Guest")
    return "Hello, %s!" % user_agent


schema = make_executable_schema(type_defs, query)

app = Flask(__name__)

# Retrieve HTML for the GraphiQL.
# If explorer implements logic dependant on current request,
# change the html(None) call to the html(request)
# and move this line to the graphql_explorer function.
explorer_html = ExplorerGraphiQL().html(None)


@app.route("/graphql", methods=["GET"])
def graphql_explorer():
    # On GET request serve the GraphQL explorer.
    # You don't have to provide the explorer if you don't want to
    # but keep on mind this will not prohibit clients from
    # exploring your API using desktop GraphQL explorer app.
    return explorer_html, 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    # GraphQL queries are always sent as POST
    data = request.get_json()

    # Note: Passing the request to the context is optional.
    # In Flask, the current request is always accessible as flask.request
    success, result = graphql_sync(
        schema,
        data,
        context_value={"request": request},
        debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code


if __name__ == "__main__":
    app.run(debug=True, port=5678)