import { SvelteMap, SvelteSet } from 'svelte/reactivity';

/* cSpell:disable Disables spell errors */
export const locationMap = new SvelteMap([
	[
		'San José',
		new SvelteMap([
			['Acosta', new SvelteSet(['Cangrejal', 'Guaitil', 'Palmichal', 'Sabanillas', 'San Ignacio'])],
			[
				'Alajuelita',
				new SvelteSet(['Alajuelita', 'Concepción', 'San Antonio', 'San Felipe', 'San Josecito'])
			],
			[
				'Aserrí',
				new SvelteSet([
					'Aserrí',
					'Legua',
					'Monterrey',
					'Salitrillos',
					'San Gabriel',
					'Tarbaca',
					'Vuelta de Jorco'
				])
			],
			['Curridabat', new SvelteSet(['Curridabat', 'Granadilla', 'Sánchez', 'Tirrases'])],
			[
				'Desamparados',
				new SvelteSet([
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
			['Dota', new SvelteSet(['Copey', 'Jardín', 'Santa María'])],
			['Escazú', new SvelteSet(['Escazú', 'San Antonio', 'San Rafael'])],
			[
				'Goicoechea',
				new SvelteSet([
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
				new SvelteSet([
					'Llano Bonito',
					'San Andrés',
					'San Antonio',
					'San Isidro',
					'San Pablo',
					'Santa Cruz'
				])
			],
			['Montes de Oca', new SvelteSet(['Mercedes', 'Sabanilla', 'San Pedro', 'San Rafael'])],
			[
				'Mora',
				new SvelteSet([
					'Colón',
					'Guayabo',
					'Jaris',
					'Picagres',
					'Piedras Negras',
					'Quitirrisí',
					'Tabarcia'
				])
			],
			['Moravia', new SvelteSet(['La Trinidad', 'San Jerónimo', 'San Vicente'])],
			[
				'Puriscal',
				new SvelteSet([
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
				new SvelteSet([
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
				new SvelteSet([
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
			[
				'Santa Ana',
				new SvelteSet(['Brasil', 'Piedades', 'Pozos', 'Salitral', 'Santa Ana', 'Uruca'])
			],
			['Tarrazú', new SvelteSet(['San Carlos', 'San Lorenzo', 'San Marcos'])],
			[
				'Tibás',
				new SvelteSet(['Anselmo Llorente', 'Cinco Esquinas', 'Colima', 'León XIII', 'San Juan'])
			],
			[
				'Turrubares',
				new SvelteSet(['Carara', 'San Juan de Mata', 'San Luis', 'San Pablo', 'San Pedro'])
			],
			[
				'Vázquez de Coronado',
				new SvelteSet([
					'Cascajal',
					'Dulce Nombre de Jesús',
					'Patalillo',
					'San Isidro',
					'San Rafael'
				])
			]
		])
	],
	[
		'Alajuela',
		new SvelteMap([
			[
				'Alajuela',
				new SvelteSet([
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
				new SvelteSet([
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
				new SvelteSet([
					'Bolivar',
					'Grecia',
					'Puente de Piedra',
					'San Isidro',
					'San José',
					'San Roque',
					'Tacares'
				])
			],
			['Guatuso', new SvelteSet(['Buenavista', 'Cote', 'Katira', 'San Rafael'])],
			['Los Chiles', new SvelteSet(['Caño Negro', 'El Amparo', 'Los Chiles', 'San Jorge'])],
			[
				'Naranjo',
				new SvelteSet([
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
			[
				'Orotina',
				new SvelteSet(['Coyolar', 'El Mastate', 'Hacienda Vieja', 'La Ceiba', 'Orotina'])
			],
			[
				'Palmares',
				new SvelteSet([
					'Buenos Aires',
					'Candelaria',
					'Esquipulas',
					'La Granja',
					'Palmares',
					'Santiago',
					'Zaragoza'
				])
			],
			[
				'Poás',
				new SvelteSet(['Carrillos', 'Sabana Redonda', 'San Juan', 'San Pedro', 'San Rafael'])
			],
			['Río Cuarto', new SvelteSet(['Río Cuarto', 'Santa Isabel', 'Santa Rita'])],
			[
				'San Carlos',
				new SvelteSet([
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
			['San Mateo', new SvelteSet(['Desmonte', 'Jesús María', 'Labrador', 'San Mateo'])],
			[
				'San Ramón',
				new SvelteSet([
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
				new SvelteSet(['Rodríguez', 'San Pedro', 'Sarchí Norte', 'Sarchí Sur', 'Toro Amarillo'])
			],
			[
				'Upala',
				new SvelteSet([
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
				new SvelteSet(['Brisas', 'Guadalupe', 'Laguna', 'Palmira', 'Tapesco', 'Zapote', 'Zarcero'])
			]
		])
	],
	[
		'Cartago',
		new SvelteMap([
			['Alvarado', new SvelteSet(['Capellades', 'Cervantes', 'Pacayas'])],
			[
				'Cartago',
				new SvelteSet([
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
			['El Guarco', new SvelteSet(['El Tejar', 'Patio de Agua', 'San Isidro', 'Tobosi'])],
			['Jiménez', new SvelteSet(['Juan Viñas', 'Pejibaye', 'Tucurrique'])],
			[
				'La Unión',
				new SvelteSet([
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
			[
				'Oreamuno',
				new SvelteSet(['Cipreses', 'Cot', 'Potrero Cerrado', 'San Rafael', 'Santa Rosa'])
			],
			[
				'Paraíso',
				new SvelteSet([
					'Birrisito',
					'Cachí',
					'Llanos de Santa Lucía',
					'Orosi',
					'Paraíso',
					'Santiago'
				])
			],
			[
				'Turrialba',
				new SvelteSet([
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
		new SvelteMap([
			[
				'Barva',
				new SvelteSet([
					'Barva',
					'San José de la Montaña',
					'San Pablo',
					'San Pedro',
					'San Roque',
					'Santa Lucía'
				])
			],
			['Belén', new SvelteSet(['La Asunción', 'La Ribera', 'San Antonio'])],
			['Flores', new SvelteSet(['Barrantes', 'Llorente', 'San Joaquín'])],
			['Heredia', new SvelteSet(['Heredia', 'Mercedes', 'San Francisco', 'Ulloa', 'Varablanca'])],
			['San Isidro', new SvelteSet(['Concepción', 'San Francisco', 'San Isidro', 'San José'])],
			['San Pablo', new SvelteSet(['Rincón de Sabanilla', 'San Pablo'])],
			[
				'San Rafael',
				new SvelteSet(['Concepción', 'San Josecito', 'San Rafael', 'Santiago', 'Ángeles'])
			],
			[
				'Santa Bárbara',
				new SvelteSet([
					'Jesús',
					'Purabá',
					'San Juan',
					'San Pedro',
					'Santa Bárbara',
					'Santo Domingo'
				])
			],
			[
				'Santo Domingo',
				new SvelteSet([
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
				new SvelteSet([
					'Cureña',
					'La Virgen',
					'Las Horquetas',
					'Llanuras del Gaspar',
					'Puerto Viejo'
				])
			]
		])
	],
	[
		'Guanacaste',
		new SvelteMap([
			['Abangares', new SvelteSet(['Colorado', 'Las Juntas', 'San Juan', 'Sierra'])],
			['Bagaces', new SvelteSet(['Bagaces', 'La Fortuna', 'Mogote', 'Río Naranjo'])],
			['Carrillo', new SvelteSet(['Belén', 'Filadelfia', 'Palmira', 'Sardinal'])],
			['Cañas', new SvelteSet(['Bebedero', 'Cañas', 'Palmira', 'Porozal', 'San Miguel'])],
			[
				'Hojancha',
				new SvelteSet(['Hojancha', 'Huacas', 'Matambú', 'Monte Romo', 'Puerto Carrillo'])
			],
			['La Cruz', new SvelteSet(['La Cruz', 'La Garita', 'Santa Cecilia', 'Santa Elena'])],
			['Liberia', new SvelteSet(['Cañas Dulces', 'Curubandé', 'Liberia', 'Mayorga', 'Nacascolo'])],
			[
				'Nandayure',
				new SvelteSet(['Bejuco', 'Carmona', 'Porvenir', 'San Pablo', 'Santa Rita', 'Zapotal'])
			],
			[
				'Nicoya',
				new SvelteSet([
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
				new SvelteSet([
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
				new SvelteSet([
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
		new SvelteMap([
			[
				'Buenos Aires',
				new SvelteSet([
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
			['Corredores', new SvelteSet(['Canoas', 'Corredor', 'La Cuesta', 'Laurel'])],
			[
				'Coto Brus',
				new SvelteSet([
					'Aguabuena',
					'Gutiérrez Braun',
					'Limoncito',
					'Pittier',
					'Sabalito',
					'San Vito'
				])
			],
			[
				'Esparza',
				new SvelteSet([
					'Caldera',
					'Espíritu Santo',
					'Macacona',
					'San Jerónimo',
					'San Juan Grande',
					'San Rafael'
				])
			],
			['Garabito', new SvelteSet(['Jacó', 'Lagunillas', 'Tárcoles'])],
			['Golfito', new SvelteSet(['Golfito', 'Guaycará', 'Pavón', 'Puerto Jiménez'])],
			['Montes de Oro', new SvelteSet(['La Unión', 'Miramar', 'San Isidro'])],
			['Monteverde', new SvelteSet(['Monteverde'])],
			[
				'Osa',
				new SvelteSet([
					'Bahía Ballena',
					'Bahía Drake',
					'Palmar',
					'Piedras Blancas',
					'Puerto Cortés',
					'Sierpe'
				])
			],
			['Parrita', new SvelteSet(['Parrita'])],
			[
				'Puntarenas',
				new SvelteSet([
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
			['Quepos', new SvelteSet(['Naranjito', 'Quepos', 'Savegre'])]
		])
	],
	[
		'Limón',
		new SvelteMap([
			['Guácimo', new SvelteSet(['Guácimo', 'Mercedes', 'Pocora'])],
			['Limón', new SvelteSet(['Limón', 'Matama', 'Río Blanco', 'Valle La Estrella'])],
			['Matina', new SvelteSet(['Batán', 'Carrandí', 'Matina'])],
			[
				'Pococí',
				new SvelteSet([
					'Cariari',
					'Colorado',
					'Guápiles',
					'Jiménez',
					'La Colonia',
					'Rita',
					'Roxana'
				])
			],
			[
				'Siquirres',
				new SvelteSet([
					'Alegría',
					'El Cairo',
					'Florida',
					'Germania',
					'Pacuarito',
					'Reventazón',
					'Siquirres'
				])
			],
			['Talamanca', new SvelteSet(['Bratsi', 'Cahuita', 'Sixaola', 'Telire'])]
		])
	]
]);
