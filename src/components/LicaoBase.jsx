function LicaoBase({ titulo, descricao, resposta }) {
    const [codigo, setCodigo] = useState("")
    const [resultado, setResultado] = useState("")
  
    const verificar = () => {
      if (codigo.includes(resposta)) {
        setResultado("✅ Parabéns!")
      } else {
        setResultado("❌ Tente novamente")
      }
    }
  
    return (
      <div className="licao-container">
        <h1>{titulo}</h1>
        <p>{descricao}</p>
  
        <textarea value={codigo} onChange={(e) => setCodigo(e.target.value)} />
  
        <button onClick={verificar}>Executar</button>
  
        <p>{resultado}</p>
      </div>
    )
  }
  
  export default LicaoBase