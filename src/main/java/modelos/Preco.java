package modelos;

public class Preco {
	private int id;
	private float preco;
	private int idProduto;
	private int idMercado;
	private String produto;
	private String mercado;

	public Preco() {
	}
	public Preco(float preco, int idProduto, int idMercado, String produto, String mercado) {
		setPreco(preco);
		setIdProduto(idProduto);
		setIdMercado(idMercado);
		setProduto(produto);
		setMercado(mercado);
	}
	public Preco(int id, float preco, int idProduto, int idMercado, String produto, String mercado) {
		setId(id);
		setPreco(preco);
		setIdProduto(idProduto);
		setIdMercado(idMercado);
		setProduto(produto);
		setMercado(mercado);
	}

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public float getPreco() {
		return preco;
	}
	public void setPreco(float preco) {
		this.preco = preco;
	}
	public int getIdProduto() {
		return idProduto;
	}
	public void setIdProduto(int idProduto) {
		this.idProduto = idProduto;
	}
	public int getIdMercado() {
		return idMercado;
	}
	public void setIdMercado(int idMercado) {
		this.idMercado = idMercado;
	}
	public String getProduto() {
		return produto;
	}
	public void setProduto(String produto) {
		if (produto!=null && produto.length()>0)
			this.produto = produto;
	}
	public String getMercado() {
		return mercado;
	}
	public void setMercado(String mercado) {
		if (mercado!=null && mercado.length()>0)
			this.mercado = mercado;
	}

}