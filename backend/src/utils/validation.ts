import { z } from 'zod';

// Schema para registro de usuário
export const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Schema para criação de campanha
export const createCampaignSchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres').max(200),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  emailSubject: z.string().min(5, 'Assunto do email deve ter no mínimo 5 caracteres'),
  emailBody: z.string().min(20, 'Corpo do email deve ter no mínimo 20 caracteres'),
  senderName: z.string().min(2, 'Nome do remetente deve ter no mínimo 2 caracteres'),
  senderEmail: z.string().email('Email do remetente inválido'),
  targetUrl: z.string().url('URL de destino inválida'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  points: z.number().int().positive().optional(),
  autoSend: z.boolean().optional(),
  cron: z.string().optional(),
});

// Schema para atualização de campanha
export const updateCampaignSchema = createCampaignSchema.partial();

// Schema para envio de email
export const sendEmailSchema = z.object({
  userIds: z.array(z.string().uuid()).optional(),
  sendToAll: z.boolean().optional(),
});

// Helper para validar dados
export const validate = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): T => {
    return schema.parse(data);
  };
};

// Middleware para validação de request
export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
};
