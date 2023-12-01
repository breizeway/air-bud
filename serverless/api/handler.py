from ariadne import graphql_sync, make_executable_schema, load_schema_from_path
from ariadne.explorer import ExplorerGraphiQL
from flask import Flask, jsonify, request
from resolvers.queries import query

app = Flask(__name__)
schema = make_executable_schema(
    load_schema_from_path("api/schema.graphql"), query)


@app.route("/graphql", methods=["GET"])
def graphql_explorer():
    return ExplorerGraphiQL().html(None), 200


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()

    success, result = graphql_sync(
        schema,
        data,
        context_value={"request": request},
        debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code
