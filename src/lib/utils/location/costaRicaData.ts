/* cSpell:disable Disables spell errors */
export const states = [
	'San José',
	'Alajuela',
	'Cartago',
	'Heredia',
	'Guanacaste',
	'Puntarenas',
	'Limón'
];
export const locationMap = new Map([
	[
		'San José',
		new Map([
			['Acosta', new Set(['Cangrejal', 'Guaitil', 'Palmichal', 'Sabanillas', 'San Ignacio'])],
			[
				'Alajuelita',
				new Set(['Alajuelita', 'Concepción', 'San Antonio', 'San Felipe', 'San Josecito'])
			],
			[
				'Aserrí',
				new Set([
					'Aserrí',
					'Legua',
					'Monterrey',
					'Salitrillos',
					'San Gabriel',
					'Tarbaca',
					'Vuelta de Jorco'
				])
			],
			['Curridabat', new Set(['Curridabat', 'Granadilla', 'Sánchez', 'Tirrases'])],
			[
				'Desamparados',
				new Set([
					'Damas',
					'Desamparados',
					'Frailes',
					'Gravilias',
					'Los Guido',
					'Patarra',
					'Rosario',
					'San Antonio',
					'San Cristobal',
					'San Juan de Dios',
					'San Miguel',
					'San Rafael Abajo',
					'San Rafael Arriba'
				])
			],
			['Dota', new Set(['Copey', 'Jardín', 'Santa María'])],
			['Escazú', new Set(['Escazú', 'San Antonio', 'San Rafael'])],
			[
				'Goicoechea',
				new Set([
					'Calle Blancos',
					'Guadalupe',
					'Ipis',
					'Mata de Plátano',
					'Purral',
					'Rancho Redondo',
					'San Francisco'
				])
			],
			[
				'León Cortés Castro',
				new Set([
					'Llano Bonito',
					'San Andrés',
					'San Antonio',
					'San Isidro',
					'San Pablo',
					'Santa Cruz'
				])
			],
			['Montes de Oca', new Set(['Mercedes', 'Sabanilla', 'San Pedro', 'San Rafael'])],
			[
				'Mora',
				new Set([
					'Colón',
					'Guayabo',
					'Jaris',
					'Picagres',
					'Piedras Negras',
					'Quitirrisí',
					'Tabarcia'
				])
			],
			['Moravia', new Set(['La Trinidad', 'San Jerónimo', 'San Vicente'])],
			[
				'Puriscal',
				new Set([
					'Barbacoas',
					'Candelarita',
					'Chires',
					'Desamparaditos',
					'Grifo Alto',
					'Mercedes Sur',
					'San Antonio',
					'San Rafael',
					'Santiago'
				])
			],
			[
				'Pérez Zeledón',
				new Set([
					'Barú',
					'Cajón',
					'Daniel Flores',
					'El General',
					'La  Amistad',
					'Paramo',
					'Pejibaye',
					'Platanares',
					'Rivas',
					'Río Nuevo',
					'San Isidro de El General',
					'San Pedro'
				])
			],
			[
				'San José',
				new Set([
					'Carmen',
					'Catedral',
					'Hatillo',
					'Hospital',
					'Mata Redonda',
					'Merced',
					'Pavas',
					'San Francisco de Dos Ríos',
					'San Sebastián',
					'Uruca',
					'Zapote'
				])
			],
			['Santa Ana', new Set(['Brasil', 'Piedades', 'Pozos', 'Salitral', 'Santa Ana', 'Uruca'])],
			['Tarrazú', new Set(['San Carlos', 'San Lorenzo', 'San Marcos'])],
			['Tibás', new Set(['Anselmo Llorente', 'Cinco Esquinas', 'Colima', 'León XIII', 'San Juan'])],
			['Turrubares', new Set(['Carara', 'San Juan de Mata', 'San Luis', 'San Pablo', 'San Pedro'])],
			[
				'Vázquez de Coronado',
				new Set(['Cascajal', 'Dulce Nombre de Jesús', 'Patalillo', 'San Isidro', 'San Rafael'])
			]
		])
	],
	[
		'Alajuela',
		new Map([
			[
				'Alajuela',
				new Set([
					'Alajuela',
					'Carrizal',
					'Desamparados',
					'Garita',
					'Guácima',
					'Río Segundo',
					'Sabanilla',
					'San Antonio',
					'San Isidro',
					'San José',
					'San Rafael',
					'Sarapiquí',
					'Tambor',
					'Turrucares'
				])
			],
			[
				'Atenas',
				new Set([
					'Atenas',
					'Concepción',
					'Escobal',
					'Jesús',
					'Mercedes',
					'San Isidro',
					'San José',
					'Santa Eulalia'
				])
			],
			[
				'Grecia',
				new Set([
					'Bolivar',
					'Grecia',
					'Puente de Piedra',
					'San Isidro',
					'San José',
					'San Roque',
					'Tacares'
				])
			],
			['Guatuso', new Set(['Buenavista', 'Cote', 'Katira', 'San Rafael'])],
			['Los Chiles', new Set(['Caño Negro', 'El Amparo', 'Los Chiles', 'San Jorge'])],
			[
				'Naranjo',
				new Set([
					'Cirrí Sur',
					'El Rosario',
					'Naranjo',
					'Palmitos',
					'San Jerónimo',
					'San José',
					'San Juan',
					'San Miguel'
				])
			],
			['Orotina', new Set(['Coyolar', 'El Mastate', 'Hacienda Vieja', 'La Ceiba', 'Orotina'])],
			[
				'Palmares',
				new Set([
					'Buenos Aires',
					'Candelaria',
					'Esquipulas',
					'La Granja',
					'Palmares',
					'Santiago',
					'Zaragoza'
				])
			],
			['Poás', new Set(['Carrillos', 'Sabana Redonda', 'San Juan', 'San Pedro', 'San Rafael'])],
			['Río Cuarto', new Set(['Río Cuarto', 'Santa Isabel', 'Santa Rita'])],
			[
				'San Carlos',
				new Set([
					'Aguas Zarcas',
					'Buenavista',
					'Cutris',
					'Florencia',
					'La Fortuna',
					'La Palmera',
					'La Tigra',
					'Monterrey',
					'Pital',
					'Pocosol',
					'Quesada',
					'Venado',
					'Venecia'
				])
			],
			['San Mateo', new Set(['Desmonte', 'Jesús María', 'Labrador', 'San Mateo'])],
			[
				'San Ramón',
				new Set([
					'Alfaro',
					'Concepción',
					'Peñas Blancas',
					'Piedades Norte',
					'Piedades Sur',
					'San Isidro',
					'San Juan',
					'San Lorenzo',
					'San Rafael',
					'San Ramón',
					'Santiago',
					'Volio',
					'Zapotal',
					'Ángeles'
				])
			],
			[
				'Sarchí',
				new Set(['Rodríguez', 'San Pedro', 'Sarchí Norte', 'Sarchí Sur', 'Toro Amarillo'])
			],
			[
				'Upala',
				new Set([
					'Aguas Claras',
					'Bijagua',
					'Canalete',
					'Delicias',
					'Dos Ríos',
					'San José O Pizote',
					'Upala',
					'Yolillal'
				])
			],
			[
				'Zarcero',
				new Set(['Brisas', 'Guadalupe', 'Laguna', 'Palmira', 'Tapesco', 'Zapote', 'Zarcero'])
			]
		])
	],
	[
		'Cartago',
		new Map([
			['Alvarado', new Set(['Capellades', 'Cervantes', 'Pacayas'])],
			[
				'Cartago',
				new Set([
					'Aguacaliente o San Francisco',
					'Carmen',
					'Corralillo',
					'Dulce Nombre',
					'Guadalupe o Arenilla',
					'Llano Grande',
					'Occidental',
					'Oriental',
					'Quebradilla',
					'San Nicolás',
					'Tierra Blanca'
				])
			],
			['El Guarco', new Set(['El Tejar', 'Patio de Agua', 'San Isidro', 'Tobosi'])],
			['Jiménez', new Set(['Juan Viñas', 'Pejibaye', 'Tucurrique'])],
			[
				'La Unión',
				new Set([
					'Concepción',
					'Dulce Nombre',
					'Río Azul',
					'San Diego',
					'San Juan',
					'San Rafael',
					'San Ramón',
					'Tres Ríos'
				])
			],
			['Oreamuno', new Set(['Cipreses', 'Cot', 'Potrero Cerrado', 'San Rafael', 'Santa Rosa'])],
			[
				'Paraíso',
				new Set(['Birrisito', 'Cachí', 'Llanos de Santa Lucía', 'Orosi', 'Paraíso', 'Santiago'])
			],
			[
				'Turrialba',
				new Set([
					'Chirripó',
					'La Isabel',
					'La Suiza',
					'Pavones',
					'Peralta',
					'Santa Cruz',
					'Santa Rosa',
					'Santa Teresita',
					'Tayutic',
					'Tres Equis',
					'Tuis',
					'Turrialba'
				])
			]
		])
	],
	[
		'Heredia',
		new Map([
			[
				'Barva',
				new Set([
					'Barva',
					'San José de la Montaña',
					'San Pablo',
					'San Pedro',
					'San Roque',
					'Santa Lucía'
				])
			],
			['Belén', new Set(['La Asunción', 'La Ribera', 'San Antonio'])],
			['Flores', new Set(['Barrantes', 'Llorente', 'San Joaquín'])],
			['Heredia', new Set(['Heredia', 'Mercedes', 'San Francisco', 'Ulloa', 'Varablanca'])],
			['San Isidro', new Set(['Concepción', 'San Francisco', 'San Isidro', 'San José'])],
			['San Pablo', new Set(['Rincón de Sabanilla', 'San Pablo'])],
			['San Rafael', new Set(['Concepción', 'San Josecito', 'San Rafael', 'Santiago', 'Ángeles'])],
			[
				'Santa Bárbara',
				new Set(['Jesús', 'Purabá', 'San Juan', 'San Pedro', 'Santa Bárbara', 'Santo Domingo'])
			],
			[
				'Santo Domingo',
				new Set([
					'Paracito',
					'Pará',
					'San Miguel',
					'San Vicente',
					'Santa Rosa',
					'Santo Domingo',
					'Santo Tomás',
					'Tures'
				])
			],
			[
				'Sarapiquí',
				new Set(['Cureña', 'La Virgen', 'Las Horquetas', 'Llanuras del Gaspar', 'Puerto Viejo'])
			]
		])
	],
	[
		'Guanacaste',
		new Map([
			['Abangares', new Set(['Colorado', 'Las Juntas', 'San Juan', 'Sierra'])],
			['Bagaces', new Set(['Bagaces', 'La Fortuna', 'Mogote', 'Río Naranjo'])],
			['Carrillo', new Set(['Belén', 'Filadelfia', 'Palmira', 'Sardinal'])],
			['Cañas', new Set(['Bebedero', 'Cañas', 'Palmira', 'Porozal', 'San Miguel'])],
			['Hojancha', new Set(['Hojancha', 'Huacas', 'Matambú', 'Monte Romo', 'Puerto Carrillo'])],
			['La Cruz', new Set(['La Cruz', 'La Garita', 'Santa Cecilia', 'Santa Elena'])],
			['Liberia', new Set(['Cañas Dulces', 'Curubandé', 'Liberia', 'Mayorga', 'Nacascolo'])],
			[
				'Nandayure',
				new Set(['Bejuco', 'Carmona', 'Porvenir', 'San Pablo', 'Santa Rita', 'Zapotal'])
			],
			[
				'Nicoya',
				new Set([
					'Belén de Nosarita',
					'Mansión',
					'Nicoya',
					'Nosara',
					'Quebrada Honda',
					'San Antonio',
					'Sámara'
				])
			],
			[
				'Santa Cruz',
				new Set([
					'Bolsón',
					'Cabo Velas',
					'Cartagena',
					'Cuajiniquil',
					'Diriá',
					'Santa Cruz',
					'Tamarindo',
					'Tempate',
					'Veintisiete de Abril'
				])
			],
			[
				'Tilarán',
				new Set([
					'Arenal',
					'Cabeceras',
					'Líbano',
					'Quebrada Grande',
					'Santa Rosa',
					'Tierras Morenas',
					'Tilarán',
					'Tronadora'
				])
			]
		])
	],
	[
		'Puntarenas',
		new Map([
			[
				'Buenos Aires',
				new Set([
					'Biolley',
					'Boruca',
					'Brunka',
					'Buenos Aires',
					'Chánguena',
					'Colinas',
					'Pilas',
					'Potrero Grande',
					'Volcán'
				])
			],
			['Corredores', new Set(['Canoas', 'Corredor', 'La Cuesta', 'Laurel'])],
			[
				'Coto Brus',
				new Set(['Aguabuena', 'Gutiérrez Braun', 'Limoncito', 'Pittier', 'Sabalito', 'San Vito'])
			],
			[
				'Esparza',
				new Set([
					'Caldera',
					'Espíritu Santo',
					'Macacona',
					'San Jerónimo',
					'San Juan Grande',
					'San Rafael'
				])
			],
			['Garabito', new Set(['Jacó', 'Lagunillas', 'Tárcoles'])],
			['Golfito', new Set(['Golfito', 'Guaycará', 'Pavón', 'Puerto Jiménez'])],
			['Montes de Oro', new Set(['La Unión', 'Miramar', 'San Isidro'])],
			['Monteverde', new Set(['Monteverde'])],
			[
				'Osa',
				new Set([
					'Bahía Ballena',
					'Bahía Drake',
					'Palmar',
					'Piedras Blancas',
					'Puerto Cortés',
					'Sierpe'
				])
			],
			['Parrita', new Set(['Parrita'])],
			[
				'Puntarenas',
				new Set([
					'Acapulco',
					'Arancibia',
					'Barranca',
					'Chacarita',
					'Chira',
					'Chomes',
					'Cóbano',
					'El Roble',
					'Guacimal',
					'Isla del Coco',
					'Lepanto',
					'Manzanillo',
					'Paquera',
					'Pitahaya',
					'Puntarenas'
				])
			],
			['Quepos', new Set(['Naranjito', 'Quepos', 'Savegre'])]
		])
	],
	[
		'Limón',
		new Map([
			['Guácimo', new Set(['Guácimo', 'Mercedes', 'Pocora'])],
			['Limón', new Set(['Limón', 'Matama', 'Río Blanco', 'Valle La Estrella'])],
			['Matina', new Set(['Batán', 'Carrandí', 'Matina'])],
			[
				'Pococí',
				new Set(['Cariari', 'Colorado', 'Guápiles', 'Jiménez', 'La Colonia', 'Rita', 'Roxana'])
			],
			[
				'Siquirres',
				new Set([
					'Alegría',
					'El Cairo',
					'Florida',
					'Germania',
					'Pacuarito',
					'Reventazón',
					'Siquirres'
				])
			],
			['Talamanca', new Set(['Bratsi', 'Cahuita', 'Sixaola', 'Telire'])]
		])
	]
]);
