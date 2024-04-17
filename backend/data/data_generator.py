from faker import Faker
import pandas as pd

fake = Faker()

"""
Data a generar

# Personas

type Persona struct {
	Nombre          string   `json:"nombre" binding:"required"`
	Apellido        string   `json:"apellido" binding:"required"`
	FechaNacimiento string   `json:"fecha_nacimiento" binding:"required"` // Formato: YYYY-MM-DD
	Genero          string   `json:"genero" binding:"required"`
	Usuario         string   `json:"usuario" binding:"required"`
	Password        string   `json:"password" binding:"required"`
}

type Estudiante struct {
	Persona
	Carnet  string `json:"carnet" binding:"required"`
	Correo  string `json:"correo" binding:"required"`
	Parqueo *bool  `json:"parqueo" binding:"required"`
	Foraneo *bool  `json:"foraneo" binding:"required"`
	Colegio string `json:"colegio" binding:"required"`
}

type Profesor struct {
	Persona
	Code           string `json:"code" binding:"required"`
	CorreoProfesor string `json:"correo_profesor" binding:"required"`
	Departamento   string `json:"departamento" binding:"required"`
	Maestria       string `json:"maestria" binding:"required"`
	Jornada        string `json:"jornada" binding:"required"`
}

type ProfesorEstudiante struct {
	Persona
	Carnet         string `json:"carnet" binding:"required"`
	Correo         string `json:"correo" binding:"required"`
	Parqueo        *bool  `json:"parqueo" binding:"required"`
	Foraneo        *bool  `json:"foraneo" binding:"required"`
	Colegio        string `json:"colegio" binding:"required"`
	Code           string `json:"code" binding:"required"`
	CorreoProfesor string `json:"correo_profesor" binding:"required"`
	Departamento   string `json:"departamento" binding:"required"`
	Maestria       string `json:"maestria" binding:"required"`
	Jornada        string `json:"jornada"`
}

"""


def generar_personas(estudiantes: int, profesores: int) -> tuple[list[dict], list[dict]]:
	estudiantes_generados = []
	for _ in range(estudiantes):
		persona = {
			"nombre": fake.first_name(),
			"apellido": fake.last_name(),
			"fecha_nacimiento": fake.date_of_birth().strftime("%Y-%m-%d"),
			"genero": fake.random_element(["Masculino", "Femenino"]),
			"usuario": fake.user_name(),
			"password": "123456",
			"carnet": fake.unique.random_number(digits=8),
			"correo": fake.email(),
			"parqueo": fake.random_element([True, False]),
			"foraneo": fake.random_element([True, False]),
			"colegio": fake.company()
		}
		estudiantes_generados.append(persona)

	profesores_generados = []
	for _ in range(profesores):
		persona = {
			"nombre": fake.first_name(),
			"apellido": fake.last_name(),
			"fecha_nacimiento": fake.date_of_birth().strftime("%Y-%m-%d"),
			"genero": fake.random_element(["Masculino", "Femenino"]),
			"usuario": fake.user_name(),
			"password": "123456",
			"code": fake.unique.random_number(digits=8),
			"correo_profesor": fake.email(),
			"departamento": fake.company(),
			"maestria": fake.company(),
			"jornada": fake.random_element(["Diurna", "Nocturna"])
		}
		profesores_generados.append(persona)

	with open("estudiantes.csv", "w") as file:
		file.write("nombre,apellido,fecha_nacimiento,genero,usuario,password,carnet,correo,parqueo,foraneo,colegio\n")
		for estudiante in estudiantes_generados:
			file.write(
				f"{estudiante['nombre']},{estudiante['apellido']},{estudiante['fecha_nacimiento']},{estudiante['genero']},{estudiante['usuario']},{estudiante['password']},{estudiante['carnet']},{estudiante['correo']},{estudiante['parqueo']},{estudiante['foraneo']},{estudiante['colegio']}\n")

	with open("profesores.csv", "w") as file:
		file.write("nombre,apellido,fecha_nacimiento,genero,usuario,password,code,correo_profesor,departamento,maestria,jornada\n")
		for profesor in profesores_generados:
			file.write(
				f"{profesor['nombre']},{profesor['apellido']},{profesor['fecha_nacimiento']},{profesor['genero']},{profesor['usuario']},{profesor['password']},{profesor['code']},{profesor['correo_profesor']},{profesor['departamento']},{profesor['maestria']},{profesor['jornada']}\n")

	return estudiantes_generados, profesores_generados


"""
type Lugar struct {
	Nombre       string `json:"nombre" binding:"required"`
	Departamento string `json:"departamento" binding:"required"`
	Tipo         string `json:"tipo" binding:"required"`
	Direccion    string `json:"direccion" binding:"required"`
	Foto         string `json:"foto" binding:"required"`
}
"""


def generar_lugares(lugares: int) -> list[dict]:
	lugares_generados = []
	for _ in range(lugares):
		lugar = {
			"nombre": fake.company(),
			"departamento": fake.company(),
			"tipo": fake.random_element(["Amigos", "Trabajo", "Estudio", "Pet Friendly"]),
			"direccion": fake.address(),
			"foto": fake.image_url()
		}
		lugares_generados.append(lugar)

	with open("lugares.csv", "w") as file:
		file.write("nombre,departamento,tipo,direccion,foto\n")
		for lugar in lugares_generados:
			address = lugar['direccion'].replace("\n", " ")
			address = address.replace(",", " ")

			name = lugar['nombre'].replace(",", " ")
			depto = lugar['departamento'].replace(",", " ")

			file.write(f"{name},{depto},{lugar['tipo']},{address},{lugar['foto']}\n")

	return lugares_generados


"""
type Equipo struct {
	Nombre               string `json:"nombre" binding:"required"`
	Deporte              string `json:"deporte" binding:"required"`
	Pais                 string `json:"pais" binding:"required"`
	Division             string `json:"division" binding:"required"`
	FechaEstablecimiento string `json:"fecha_establecimiento" binding:"required"`
}
"""


def generar_equipos() -> list[dict]:
	# leer el archivo de equipos en src/Football Teams.csv
	df = pd.read_csv("src/Football Teams.csv")

	equipos_generados = []
	for _ in range(df.shape[0]):
		equipo = {
			"nombre": df["Team"][_],
			"deporte": "Futbol",
			"pais": fake.country(),
			"division": df["Tournament"][_],
			"fecha_establecimiento": fake.date_of_birth().strftime("%Y-%m-%d")
		}
		equipos_generados.append(equipo)

	with open("equipos.csv", "w") as file:
		file.write("nombre,deporte,pais,division,fecha_establecimiento\n")
		for equipo in equipos_generados:
			file.write(f"{equipo['nombre']},{equipo['deporte']},{equipo['pais']},{equipo['division']},{equipo['fecha_establecimiento']}\n")

	return equipos_generados


"""
type Cancion struct {
	Nombre           string  `json:"nombre" binding:"required"`
	Disco            string  `json:"disco" binding:"required"`
	FechaLanzamiento string  `json:"fecha_lanzamiento" binding:"required"` // Formato: YYYY-MM-DD
	Duracion         float64 `json:"duracion" binding:"required"`
	Genero           string  `json:"genero" binding:"required"`
}
"""


def generar_canciones(canciones: int) -> list[dict]:
	# leer el archivo de canciones en src/tcc_ceds_music.csv
	df = pd.read_csv("src/tcc_ceds_music.csv")
	df = df.dropna()
	# seleccionar aleatoriamente 'canciones' canciones

	df = df.sample(n=canciones)

	print(df.head())

	canciones_generadas = []
	for row in df.iterrows():
		# format time from string
		r_date = row[1]["release_date"] # solo el año
		r_date = f"{r_date}-01-01"
		r_date = pd.to_datetime(r_date).strftime("%Y-%m-%d")

		cancion = {
			"nombre": row[1]["track_name"],
			"disco": row[1]["artist_name"],
			"fecha_lanzamiento": r_date,
			"duracion": float(row[1]["len"]),
			"genero": row[1]["genre"]
		}
		canciones_generadas.append(cancion)

	with open("canciones.csv", "w", encoding="utf-8") as file:
		file.write("nombre,disco,fecha_lanzamiento,duracion,genero\n")
		for cancion in canciones_generadas:
			file.write(f"{cancion['nombre']},{cancion['disco']},{cancion['fecha_lanzamiento']},{cancion['duracion']},{cancion['genero']}\n")


if __name__ == "__main__":
	estudiantes, profesores = generar_personas(2000, 500)
	lugares = generar_lugares(1000)
	equipos = generar_equipos()  # 100 equipos
	canciones = generar_canciones(1500)

	# estudiantes, profesores = generar_personas(10, 10)
	# lugares = generar_lugares(10)
	# equipos = generar_equipos()  # 100 equipos
	# canciones = generar_canciones(10)
