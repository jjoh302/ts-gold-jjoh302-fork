/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
		      colors: {
        'button-yellow': '#ffeb90',
      },
		
		width: {
        '38': '5.8rem',
      },
      height: {
        '54': '13.5rem',
        '56': '14rem',
        '58': '14.5rem',
        '60': '15rem',
        '62': '15.5rem',
        '64': '16rem',
        '66': '16.5rem',
        '68': '17rem',
        '70': '17.5rem',
        '72': '18rem',
        '74': '18.5rem',
        '76': '19rem',
        '78': '19.5rem',
        '80': '20rem',
        '82': '20.5rem',
        '84': '21rem',
        '86': '21.5rem',
        '88': '22rem',
        '90': '22.5rem',
        '92': '23rem',
        '94': '23.5rem',
        '96': '24rem',
        // Taller options
        '100': '25rem',
        '104': '26rem',
        '108': '27.3rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem',
        '124': '31rem',
        '128': '32rem',
        '132': '33rem',
        '136': '34rem',
        '140': '35rem',
        '144': '36rem',
        // Add more if needed
      },
	  fontSize: {
        xxs: '.625rem', // 10px
		nml: '1.1rem', // pencil
      },
    },
  },
  plugins: [],
}
