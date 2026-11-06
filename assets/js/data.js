/* ============================================================
   NEXUS · Banco léxico
   20 categorías · sin acentos ni Ñ (compatibilidad de rejilla)
   ============================================================ */
window.NEXUS_CATEGORIES = [
  {
    id: 'animales',
    name: 'Animales',
    code: 'FAUNA',
    words: [
      'PERRO','GATO','CABALLO','TIGRE','LEON','ELEFANTE','JIRAFA','MONO','CONEJO','RATON',
      'LOBO','ZORRO','OSO','TORTUGA','DELFIN','BALLENA','AGUILA','SERPIENTE','CEBRA','PANDA',
      'KOALA','HIPOPOTAMO','RINOCERONTE','COCODRILO','TIBURON','RANA','ABEJA','HORMIGA','MARIPOSA','GALLINA',
      'PATO','VACA','OVEJA','CABRA','MURCIELAGO','BUHO','PINGUINO','FOCA','PULPO','CAMALEON'
    ]
  },
  {
    id: 'frutas',
    name: 'Frutas',
    code: 'FRUIT',
    words: [
      'MANZANA','PLATANO','NARANJA','PERA','UVA','SANDIA','MELON','FRESA','CEREZA','MANGO',
      'PAPAYA','KIWI','LIMON','DURAZNO','COCO','HIGO','GRANADA','FRAMBUESA','ARANDANO','MORA',
      'GUAYABA','AGUACATE','PINA','MANDARINA','GROSELLA','DATIL','MEMBRILLO','CAQUI','LIMA','NISPERO'
    ]
  },
  {
    id: 'paises',
    name: 'Países',
    code: 'GEO',
    words: [
      'PERU','CHILE','ARGENTINA','BRASIL','COLOMBIA','MEXICO','CANADA','FRANCIA','ITALIA','ALEMANIA',
      'JAPON','CHINA','INDIA','EGIPTO','GRECIA','PORTUGAL','RUSIA','NORUEGA','SUECIA','FINLANDIA',
      'ISLANDIA','MARRUECOS','KENIA','AUSTRALIA','VENEZUELA','ECUADOR','BOLIVIA','PARAGUAY','URUGUAY','CUBA',
      'PANAMA','HONDURAS','GUATEMALA','NICARAGUA','TURQUIA','VIETNAM'
    ]
  },
  {
    id: 'colores',
    name: 'Colores',
    code: 'CHROMA',
    words: [
      'ROJO','AZUL','VERDE','AMARILLO','NARANJA','MORADO','ROSA','NEGRO','BLANCO','GRIS',
      'MARRON','TURQUESA','DORADO','PLATEADO','VIOLETA','CELESTE','BEIGE','COBALTO','ESMERALDA','CARMESI',
      'INDIGO','LILA','CREMA','OCRE','FUCSIA','MAGENTA','TERRACOTA','MARFIL'
    ]
  },
  {
    id: 'deportes',
    name: 'Deportes',
    code: 'ARENA',
    words: [
      'FUTBOL','TENIS','NATACION','CICLISMO','ATLETISMO','BALONCESTO','VOLEIBOL','BEISBOL','BOXEO','JUDO',
      'KARATE','GOLF','RUGBY','HOCKEY','SURF','ESGRIMA','GIMNASIA','REMO','PATINAJE','ESCALADA',
      'ARQUERIA','HALTEROFILIA','TAEKWONDO','BADMINTON','ESQUI','VELA','CANOTAJE','PELOTA'
    ]
  },
  {
    id: 'profesiones',
    name: 'Profesiones',
    code: 'GREMIOS',
    words: [
      'MEDICO','ABOGADO','INGENIERO','MAESTRO','ARQUITECTO','ENFERMERO','PILOTO','BOMBERO','POLICIA','COCINERO',
      'CARPINTERO','ELECTRICISTA','PLOMERO','PERIODISTA','ACTOR','MUSICO','PINTOR','ESCRITOR','CIENTIFICO','PROGRAMADOR',
      'CONTADOR','VETERINARIO','FARMACEUTICO','DENTISTA','PANADERO','PESCADOR','JARDINERO','SECRETARIO'
    ]
  },
  {
    id: 'instrumentos',
    name: 'Instrumentos',
    code: 'SONIDO',
    words: [
      'GUITARRA','PIANO','VIOLIN','TAMBOR','FLAUTA','SAXOFON','TROMPETA','BATERIA','ARPA','CELLO',
      'CLARINETE','TROMBON','UKELELE','ACORDEON','SINTETIZADOR','XILOFONO','MARACAS','BANJO','MANDOLINA','TUBA',
      'GAITA','CHARANGO','BANDURRIA','ORGANO','TIMPANO','CONTRABAJO'
    ]
  },
  {
    id: 'espacio',
    name: 'Espacio',
    code: 'ORBITA',
    words: [
      'MERCURIO','VENUS','TIERRA','MARTE','JUPITER','SATURNO','URANO','NEPTUNO','PLUTON','COMETA',
      'ASTEROIDE','GALAXIA','NEBULOSA','ESTRELLA','SATELITE','COHETE','ORBITA','ECLIPSE','METEORITO','TELESCOPIO',
      'ASTRONAUTA','SUPERNOVA','CUASAR','COSMOS','ANDROMEDA','GRAVEDAD','MODULO','TRAYECTORIA'
    ]
  },
  {
    id: 'comidas',
    name: 'Comidas',
    code: 'SABOR',
    words: [
      'PIZZA','HAMBURGUESA','TACO','SUSHI','PASTA','ARROZ','POLLO','ENSALADA','SOPA','TORTILLA',
      'EMPANADA','CEVICHE','PAELLA','LASANA','RAVIOLI','PANQUEQUE','HELADO','CHOCOLATE','GALLETA','PAN',
      'QUESO','JAMON','SALCHICHA','PURE','TAMAL','ANTOJO','GUISO','ESTOFADO','BROCHETA','CROQUETA'
    ]
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    code: 'LIQUIDO',
    words: [
      'AGUA','LECHE','CAFE','JUGO','LIMONADA','REFRESCO','CERVEZA','VINO','CHAMPAN','COCTEL',
      'SMOOTHIE','BATIDO','INFUSION','SIDRA','WHISKY','RON','VODKA','TEQUILA','MATE','HORCHATA',
      'NECTAR','MALTEADA','EXPRIMIDO','TONICA','ABSENTA','KOMBUCHA','LAGER'
    ]
  },
  {
    id: 'transporte',
    name: 'Transporte',
    code: 'TRANSITO',
    words: [
      'COCHE','BICICLETA','MOTO','TREN','AVION','BARCO','HELICOPTERO','CAMION','AUTOBUS','TAXI',
      'SUBMARINO','LANCHA','PATINETA','TRANVIA','METRO','FURGONETA','YATE','GLOBO','DIRIGIBLE','TRACTOR',
      'MOTONETA','FURGON','VELERO','FERRY','MONOPATIN'
    ]
  },
  {
    id: 'cuerpo',
    name: 'Cuerpo',
    code: 'BIOMA',
    words: [
      'CABEZA','BRAZO','PIERNA','MANO','PIE','OJO','NARIZ','BOCA','OREJA','DEDO',
      'RODILLA','HOMBRO','CORAZON','PULMON','HIGADO','ESTOMAGO','CEREBRO','HUESO','MUSCULO','SANGRE',
      'PIEL','DIENTE','LENGUA','CUELLO','TOBILLO','CODO','CEJA','PESTANA','ARTERIA','TENDON'
    ]
  },
  {
    id: 'ropa',
    name: 'Ropa',
    code: 'TEXTIL',
    words: [
      'CAMISA','PANTALON','VESTIDO','FALDA','CHAQUETA','ABRIGO','ZAPATO','BOTA','SOMBRERO','GORRA',
      'GUANTE','BUFANDA','CALCETIN','CINTURON','CORBATA','SUDADERA','BLUSA','SHORT','TRAJE','SANDALIA',
      'BIKINI','PIJAMA','CHALECO','PONCHO','MEDIAS','BOTON','CREMALLERA'
    ]
  },
  {
    id: 'tecnologia',
    name: 'Tecnología',
    code: 'NUCLEO',
    words: [
      'COMPUTADORA','TECLADO','PANTALLA','IMPRESORA','INTERNET','SERVIDOR','ALGORITMO','ROBOT','CELULAR','TABLETA',
      'AUDIFONO','CAMARA','PROCESADOR','MEMORIA','SOFTWARE','HARDWARE','PIXEL','CODIGO','DATOS','SENSOR',
      'CIRCUITO','ANTENA','BATERIA','MODEM','APLICACION','DRON','VIRTUAL','ENLACE'
    ]
  },
  {
    id: 'plantas',
    name: 'Flores y Plantas',
    code: 'BOTANICA',
    words: [
      'ROSA','TULIPAN','GIRASOL','MARGARITA','ORQUIDEA','CLAVEL','LIRIO','JAZMIN','DALIA','PEONIA',
      'AZALEA','GARDENIA','CACTUS','PALMERA','HELECHO','PINO','ROBLE','SAUCE','BAMBU','LAVANDA',
      'ROMERO','ALBAHACA','MENTA','JACINTO','CAMELIA','BEGONIA','ACACIA','MUSGO'
    ]
  },
  {
    id: 'oceano',
    name: 'Océano',
    code: 'ABISAL',
    words: [
      'MAR','OCEANO','CORAL','MEDUSA','OLAS','MAREA','ARRECIFE','ALGA','PLAYA','ISLA',
      'PESCADO','CALAMAR','LANGOSTA','CANGREJO','ANEMONA','MANGLAR','TSUNAMI','BUCEO','ANCLA','TIMON',
      'VELA','PUERTO','FARO','ARENA','SAL','ESPUMA','MOLUSCO','ERIZO','ORCA','NAUFRAGIO'
    ]
  },
  {
    id: 'cine',
    name: 'Cine y Series',
    code: 'PANTALLA',
    words: [
      'PELICULA','ACTOR','DIRECTOR','GUION','CAMARA','ESCENA','TRAILER','ESTRENO','COMEDIA','DRAMA',
      'TERROR','FANTASIA','ANIMACION','DOCUMENTAL','SAGA','SECUELA','PREMIO','ALFOMBRA','CINE','SERIE',
      'EPISODIO','TEMPORADA','REPARTO','CRITICA','FESTIVAL','MONTAJE','SONIDO','RODAJE'
    ]
  },
  {
    id: 'videojuegos',
    name: 'Videojuegos',
    code: 'ARCADE',
    words: [
      'CONSOLA','MANDO','NIVEL','JUGADOR','AVENTURA','ARCADE','PUNTAJE','JOYSTICK','TORNEO','ESTRATEGIA',
      'MUNDO','PORTAL','ESPADA','MAGIA','DRAGON','CASTILLO','CARRERA','DISPAROS','STREAMING','SKIN',
      'SERVIDOR','EQUIPO','LOGRO','MISION','JEFE','PODER','RANKING','PIXELES'
    ]
  },
  {
    id: 'musica',
    name: 'Música',
    code: 'FRECUENCIA',
    words: [
      'RITMO','MELODIA','ACORDE','ESCALA','CORO','VERSO','COMPAS','NOTA','ARMONIA','SINFONIA',
      'OPERA','JAZZ','ROCK','SALSA','CUMBIA','BACHATA','REGGAE','TANGO','FLAMENCO','ELECTRONICA',
      'CONCIERTO','BANDA','SOLISTA','DISCO','ALBUM','ESTRIBILLO','TEMPO','FUNK'
    ]
  },
  {
    id: 'naturaleza',
    name: 'Naturaleza',
    code: 'BIOSFERA',
    words: [
      'LLUVIA','NIEVE','VIENTO','TRUENO','RAYO','NUBE','SOL','LUNA','ARCOIRIS','TORMENTA',
      'GRANIZO','NIEBLA','ROCIO','CALOR','FRIO','BOSQUE','SELVA','DESIERTO','MONTANA','RIO',
      'LAGO','VOLCAN','VALLE','CASCADA','PRADERA','GLACIAR','DUNAS','JUNGLA','CIELO'
    ]
  }
];
