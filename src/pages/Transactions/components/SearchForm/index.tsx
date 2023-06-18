import { MagnifyingGlass } from '@phosphor-icons/react'
import { SearchFormContainer } from './styles'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContextSelector } from 'use-context-selector'
import { TransactionsContext } from '../../../../contexts/TransactionsContext'

/**
 * Por que um componente renderiza?
 * - Hooks change (mudou estado, contexto, reducer)
 * - Props change (mudou propriedades)
 * - Parent rerendered (componente pai)

 * Qual o fluxo de renderização?
 * - 1. React recria a HTML da interface daquele componente
 * - 2. Compara a versão do HTML recriada com a versão anterior
 * - 3. SE mudou alguma coisa, ele reescreve o HTML na tela
 * 
 * Memo:
 * - 0. Hooks changed, Props changed (deep comparison)
 * - 0.1 Se mudou algo, ele vai permitir a nova renderização
 */

const searchFormSchema = z.object({
  query: z.string(),
})

// Tipagem do formulario usando zod
type SearchFormInputs = z.infer<typeof searchFormSchema>

export function SearchForm() {
  const fetchTransactions = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.fetchTransactions
    },
  )

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
  })

  async function handleSearchTransactions(data: SearchFormInputs) {
    await fetchTransactions(data.query)
  }

  return (
    <SearchFormContainer onSubmit={handleSubmit(handleSearchTransactions)}>
      <input
        {...register('query')}
        type="text"
        placeholder="Busque por transações"
      />

      <button type="submit" disabled={isSubmitting}>
        <MagnifyingGlass size={20} />
        Buscar
      </button>
    </SearchFormContainer>
  )
}
