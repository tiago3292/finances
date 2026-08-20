import { useState } from 'react';
import { createItem, updateItem } from '../api/items';

export default function ItemForm({ onItemAdded, onClose }) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('gasto');
  const [category, setCategory] = useState('mercado');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Cria o registro no banco
      const newItem = await createItem({
        title,
        value: parseFloat(value),
        type,
        category,
      });

      // 2. Se houver comprovante, faz o upload vinculando ao ID criado
      if (file && newItem?.id) {
        await uploadItemFile(newItem.id, file);
      }

      onItemAdded();
      if (onClose) onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao salvar item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border-4 border-zinc-100 p-6 shadow-[8px_8px_0px_0px_rgba(244,244,245,1)] font-mono text-zinc-100 max-w-md w-full">
      <div className="flex justify-between items-center mb-6 border-b-4 border-zinc-100 pb-2">
        <h2 className="text-xl font-black uppercase">Novo Registro</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 font-bold"
          >
            [X]
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-950 border-2 border-rose-500 text-rose-200 p-2 text-xs mb-4 uppercase font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase mb-1 text-zinc-400">
            Tipo
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType('gasto')}
              className={`p-2 border-2 border-zinc-100 font-bold uppercase transition-all ${
                type === 'gasto'
                  ? 'bg-rose-500 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(244,244,245,1)]'
                  : 'bg-zinc-950 text-zinc-400'
              }`}
            >
              Gasto (-)
            </button>
            <button
              type="button"
              onClick={() => setType('ganho')}
              className={`p-2 border-2 border-zinc-100 font-bold uppercase transition-all ${
                type === 'ganho'
                  ? 'bg-emerald-500 text-zinc-950 shadow-[2px_2px_0px_0px_rgba(244,244,245,1)]'
                  : 'bg-zinc-950 text-zinc-400'
              }`}
            >
              Ganho (+)
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1 text-zinc-400">
            Título
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-950 border-2 border-zinc-100 p-2 text-zinc-100 font-bold focus:outline-none"
            placeholder="Ex: Mercado, Salário..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1 text-zinc-400">
            Valor (R$)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-zinc-950 border-2 border-zinc-100 p-2 text-zinc-100 font-bold focus:outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1 text-zinc-400">
            Categoria
          </label>
          <input
            type="text"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-zinc-950 border-2 border-zinc-100 p-2 text-zinc-100 font-bold focus:outline-none"
            placeholder="Ex: mercado, vale, transporte"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase mb-1 text-zinc-400">
            Comprovante (Imagem)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full bg-zinc-950 border-2 border-zinc-100 p-2 text-xs text-zinc-400 file:mr-4 file:bg-zinc-100 file:text-zinc-950 file:border-0 file:font-bold file:uppercase file:px-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-100 text-zinc-950 font-black uppercase p-3 border-2 border-zinc-100 hover:bg-zinc-300 active:translate-x-1 active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-2"
        >
          {loading ? 'Processando...' : 'Cadastrar Item'}
        </button>
      </form>
    </div>
  );
}