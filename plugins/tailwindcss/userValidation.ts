import plugin from 'tailwindcss/plugin';

const userValidation = plugin(function ({ addVariant }) {
	addVariant('user-valid', '&:user-valid');
	addVariant('user-invalid', '&:user-invalid');
});

export default userValidation;
