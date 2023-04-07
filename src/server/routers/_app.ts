import { z } from "zod";
import { procedure, router } from "../trpc";
export const appRouter = router({
  getTodos: procedure.query(async ({ input, ctx }) => {
    const todos = await ctx.prisma.todo.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      todos,
    };
  }),

  createTodo: procedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const todo = await ctx.prisma.todo.create({
        data: {
          title: input.title,
        },
      });

      return todo;
    }),
  deleteTodo: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const todo = await ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });

      return todo;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
