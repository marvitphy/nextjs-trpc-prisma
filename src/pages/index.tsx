import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trpc } from "../utils/trpc";
const schema = z.object({
  title: z.string({
    required_error: "O título é obrigatório",
  }),
});

type FormSchemaType = z.infer<typeof schema>;

export default function IndexPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });
  const { data: todos, refetch, isFetching } = trpc.getTodos.useQuery();
  const { mutateAsync: createTodo } = trpc.createTodo.useMutation();
  const { mutateAsync: deleteTodo } = trpc.deleteTodo.useMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo({
        id,
      });
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (data: { title: string }) => {
    try {
      const { title } = data;
      const result = await createTodo({
        title,
      });

      reset();

      console.log(result);
      refetch();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center space-y-6 pt-8 flex-col h-full text-white">
      <form className="flex flex-col gap-2 " onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          disabled={isFetching}
          autoComplete="new-password"
          id="title"
          {...register("title")}
          placeholder="Título da tarefa"
          className={`${
            isFetching ? "bg-slate-400" : "bg-white"
          } w-[450px] text-black p-3 transition-all rounded-sm `}
        />
        {errors.title && (
          <span className="text-red-500">{errors.title.message}</span>
        )}
      </form>

      <div className="flex w-[450px]  flex-col gap-2">
        {todos?.todos && todos.todos.length > 0 ? (
          todos.todos.map((todo: { id: string; title: string }) => (
            <button
              onClick={() => handleDelete(todo.id)}
              key={todo.id}
              className="flex bg-slate-800 p-3 rounded-md gap-2"
            >
              <span>{todo.title}</span>
            </button>
          ))
        ) : (
          <span className="text-center">Nenhuma tarefa encontrada</span>
        )}
      </div>
    </main>
  );
}
