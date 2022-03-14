<script>
  export let size;
</script>

<main>
  <h1>Parametrized Eller's Mazes</h1>
  <div id="container">
    <canvas id="mazeCanvas" width={size + 3} height={size + 3} />
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  #container {
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
		h1 {
			font-size: 4em;
		}
  }
</style>
