import random
from datetime import datetime

import pandas as pd
from neo4j import GraphDatabase
import dotenv
import os


def insertar_estudiantes(tx, done=False) -> list[str]:
    estudiantes = pd.read_csv('estudiantes.csv', sep=',', encoding='utf-8', on_bad_lines='skip', index_col=False)

    estudiantes_insertados = []

    for _, estudiante in estudiantes.iterrows():
        estudiantes_insertados.append(estudiante['usuario'])

    if not done:
        for _, estudiante in estudiantes.iterrows():
            d = estudiante['fecha_nacimiento']  # 2000-01-01
            d = datetime.strptime(d, '%Y-%m-%d')

            tx.run(
                """
                MERGE (e:Persona:Estudiante {
                    Nombre: $nombre,
                    Apellido: $apellido,
                    FechaNacimiento: datetime($fecha_nacimiento),
                    Genero: $genero,
                    Usuario: $usuario,
                    Password: $password,
                    Carnet: $carnet,
                    Correo: $correo,
                    Parqueo: $parqueo,
                    Foraneo: $foraneo,
                    Colegio: $colegio
                })
                """,
                nombre=estudiante['nombre'],
                apellido=estudiante['apellido'],
                fecha_nacimiento=d,
                genero=estudiante['genero'],
                usuario=estudiante['usuario'],
                password=str(estudiante['password']),
                carnet=estudiante['carnet'],
                correo=estudiante['correo'],
                parqueo=estudiante['parqueo'],
                foraneo=estudiante['foraneo'],
                colegio=estudiante['colegio']
            )

    return estudiantes_insertados


def insertar_profesores(tx, done=False) -> list[str]:
    profesores = pd.read_csv('profesores.csv', sep=',', encoding='utf-8', on_bad_lines='skip', index_col=False)

    print(profesores.head())

    profesores_insertados = []

    for _, profesor in profesores.iterrows():
        profesores_insertados.append(profesor['usuario'])

    if not done:
        for _, profesor in profesores.iterrows():
            d = profesor['fecha_nacimiento']  # 2000-01-01
            d = datetime.strptime(d, '%Y-%m-%d')

            tx.run(
                """
                MERGE (p:Persona:Profesor {
                    Nombre: $nombre,
                    Apellido: $apellido,
                    FechaNacimiento: datetime($fecha_nacimiento),
                    Genero: $genero,
                    Usuario: $usuario,
                    Password: $password,
                    Code: $code,
                    CorreoProfesor: $correo_profesor,
                    Departamento: $departamento,
                    Maestria: $maestria,
                    Jornada: $jornada
                })
                """,
                nombre=profesor['nombre'],
                apellido=profesor['apellido'],
                fecha_nacimiento=d,
                genero=profesor['genero'],
                usuario=profesor['usuario'],
                password=str(profesor['password']),
                code=profesor['code'],
                correo_profesor=profesor['correo_profesor'],
                departamento=profesor['departamento'],
                maestria=profesor['maestria'],
                jornada=profesor['jornada']
            )

    return profesores_insertados


def insertar_canciones(tx, done=False) -> list[str]:
    canciones = pd.read_csv('canciones.csv', sep=',', encoding='utf-8', on_bad_lines='skip', index_col=False)

    canciones_insertadas = []

    for _, cancion in canciones.iterrows():
        canciones_insertadas.append(cancion['nombre'])

    if not done:
        for _, cancion in canciones.iterrows():
            d = cancion['fecha_lanzamiento']  # 2021-10-01
            d = datetime.strptime(d, '%Y-%m-%d').date()

            tx.run(
                """
                MERGE (c:Cancion {
                    Nombre: $nombre,
                    Disco: $disco,
                    FechaDeLanzamiento: $fecha_lanzamiento,
                    Duracion: $duracion,
                    Genero: $genero
                })
                """,
                nombre=cancion['nombre'],
                disco=cancion['disco'],
                fecha_lanzamiento=d,
                duracion=cancion['duracion'],
                genero=cancion['genero']
            )

    return canciones_insertadas


def insertar_equipos(tx, done=False) -> list[str]:
    equipos = pd.read_csv('equipos.csv', sep=',', encoding='utf-8', on_bad_lines='skip', index_col=False)

    equipos_insertados = []

    for _, equipo in equipos.iterrows():
        equipos_insertados.append(equipo['nombre'])

    if not done:
        for _, equipo in equipos.iterrows():
            d = equipo['fecha_establecimiento']  # 2021-10-01
            d = datetime.strptime(d, '%Y-%m-%d').date()

            tx.run(
                """
                MERGE (e:Equipo {
                    Nombre: $nombre,
                    Deporte: $deporte,
                    País: $pais,
                    División: $division,
                    FechaDeEstablecimiento: $fecha_establecimiento
                })
                """,
                nombre=equipo['nombre'],
                deporte=equipo['deporte'],
                pais=equipo['pais'],
                division=equipo['division'],
                fecha_establecimiento=d
            )

    return equipos_insertados


def insertar_lugares(tx, done=False) -> list[str]:
    lugares = pd.read_csv('lugares.csv', sep=',', encoding='utf-8', on_bad_lines='skip', index_col=False)

    lugares_insertados = []

    for _, lugar in lugares.iterrows():
        lugares_insertados.append(lugar['nombre'])

    if not done:
        for _, lugar in lugares.iterrows():
            tx.run(
                """
                MERGE (l:Lugar {
                    Nombre: $nombre,
                    Departamento: $departamento,
                    Tipo: $tipo,
                    Dirección: $direccion,
                    Foto: $foto
                })
                """,
                nombre=lugar['nombre'],
                departamento=lugar['departamento'],
                tipo=lugar['tipo'],
                direccion=lugar['direccion'],
                foto=lugar['foto']
            )

    return lugares_insertados


def insertar_relaciones_canciones(tx, canciones: list[str], usuario: str):
    relaciones = ["LE_GUSTA", "NO_LE_GUSTA", "ES_FAVORITA"]

    for i in range(len(relaciones)):
        rel = relaciones[i]
        can = random.choice(canciones)
        tx.run(
            f"""
            MATCH (c:Cancion), (u:Persona)
            WHERE c.Nombre = $cancion AND u.Usuario = $usuario
            CREATE (u)-[:{rel}]->(c)
            """,
            cancion=can,
            usuario=usuario
        )


def insertar_relaciones_equipos(tx, equipos: list[str], usuario: str):
    relaciones = ["APOYA", "RECHAZA"]

    for i in range(len(relaciones)):
        rel = relaciones[i]
        eq = random.choice(equipos)
        tx.run(
            f"""
            MATCH (e:Equipo), (u:Persona)
            WHERE e.Nombre = $equipo AND u.Usuario = $usuario
            CREATE (u)-[:{rel}]->(e)
            """,
            equipo=eq,
            usuario=usuario
        )


def insertar_relaciones_lugares(tx, lugares: list[str], usuario: str):
    relaciones = ["VISITA", "NO_LE_GUSTA"]

    for i in range(len(relaciones)):
        rel = relaciones[i]
        lugar = random.choice(lugares)
        tx.run(
            f"""
            MATCH (l:Lugar), (u:Persona)
            WHERE l.Nombre = $lugar AND u.Usuario = $usuario
            CREATE (u)-[:{rel}]->(l)
            """,
            lugar=lugar,
            usuario=usuario
        )


if __name__ == '__main__':
    dotenv.load_dotenv()
    uri = os.getenv('NEO4J_URI')
    auth = (os.getenv('NEO4J_USERNAME'), os.getenv('NEO4J_PASSWORD'))
    driver = GraphDatabase.driver(uri, auth=auth)

    print("Connection to the Neo4j database is successful.")

    DONE = False  # Para ahorrar tiempo, se puede cambiar a False para insertar los datos. Se usa Merge para evitar duplicados.

    with driver.session() as session:
        estudiantes = insertar_estudiantes(session, done=DONE)
        profesores = insertar_profesores(session, done=DONE)
        canciones = insertar_canciones(session, done=DONE)
        equipos = insertar_equipos(session, done=DONE)
        lugares = insertar_lugares(session, done=DONE)

        for est in estudiantes:
            insertar_relaciones_canciones(session, canciones, est)
            insertar_relaciones_equipos(session, equipos, est)
            insertar_relaciones_lugares(session, lugares, est)

        for prof in profesores:
            insertar_relaciones_canciones(session, canciones, prof)
            insertar_relaciones_equipos(session, equipos, prof)
            insertar_relaciones_lugares(session, lugares, prof)

    driver.close()
