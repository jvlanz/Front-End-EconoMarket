package interfaces;

import java.util.List;

public interface ICRUD<T,t> {
	T inserir(T obj);
	void deletar(t id);
	void alterar(T obj);
	T consultar(t id);
	List<T> consultar();
}