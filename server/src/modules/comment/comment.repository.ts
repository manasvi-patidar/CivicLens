import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export const createComment = async (data: Prisma.CommentCreateInput) => {
  return prisma.comment.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

export const getCommentsByIssueId = async (issueId: string) => {
  return prisma.comment.findMany({
    where: {
      issueId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const getCommentById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
  });
};

export const updateComment = async (id: string, content: string) => {
  return prisma.comment.update({
    where: { id },
    data: { content },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });
};

export const deleteComment = async (id: string) => {
  return prisma.comment.delete({
    where: { id },
  });
};
