import {defineType, defineField} from 'sanity'

export const submission = defineType({
  name: 'submission',
  title: 'Предложение',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Име на агенцията',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'website',
      title: 'Уебсайт',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Услуги',
      description: 'Свободен текст — какво предлага агенцията',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'city',
      title: 'Град',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: 'email',
      title: 'Имейл за обратна връзка',
      description: 'Незадължително — за уточнения преди публикуване',
      type: 'string',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Подадено на',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      options: {
        list: [
          {title: 'В изчакване', value: 'pending'},
          {title: 'Прегледано', value: 'reviewed'},
          {title: 'Одобрено', value: 'approved'},
          {title: 'Отхвърлено', value: 'rejected'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      city: 'city',
      website: 'website',
      status: 'status',
    },
    prepare({title, city, website, status}) {
      const statusLabel: Record<string, string> = {
        pending: '[В изчакване]',
        reviewed: '[Прегледано]',
        approved: '[Одобрено]',
        rejected: '[Отхвърлено]',
      }
      const tag = status ? statusLabel[status as string] || '' : ''
      return {
        title: tag ? `${tag} ${title}` : title,
        subtitle: [city, website].filter(Boolean).join(' · '),
      }
    },
  },
  orderings: [
    {
      title: 'Най-нови първо',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
  ],
})
