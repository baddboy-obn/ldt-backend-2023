export enum CheckoutStatus {
  IN_PROGRESS = 'in-progress',
  PLANNED = 'planned',
  COMPLETED = 'completed',
  SIGNED = 'signed',
  ARCHIVE = 'archive',
}

export enum AuditType {
  PLANNED = 'planned',
  TARGET = 'target',
}

export enum UserRole {
  METHODIST = 'methodist',
  CHIEF_PHYSICIAN = 'chief_physician',
  SUB_CHIEF = 'sub_chief',
  ADMIN = 'admin',
  MEDICAL_SUBSTITUTE = 'medical_substitute',
  EXPERT_DEPUTY = 'expert_deputy',
}

type TAllStats = {
  green: number
  warning: number
  error: number
  unchecked: number
  cardsCount: number
}

export type TAppointsResult = {
  id: string | number
  appointData: {
    gender: string
    birthDate: string
    patientId: string | number
    mkbCode: string
    mkbName: string
    serviceDate: string
    doctorJobTitle: string
  }
  error?: string[]
  result?: {
    average: number
    max: number
    min: number
    list: {
      actualRecommendation: string
      conjunction: {
        [1]: {
          mcbRecommendation: string
          score: number
        }
        [2]: {
          mcbRecommendation: string
          score: number
        }
        [3]: {
          mcbRecommendation: string
          score: number
        }
      }
    }[]
  }
}

export type TAuditPageResult = {
  name: string
  num: number
  id: string | number
  type: AuditType
  status: CheckoutStatus
  dateStart: string
  dateEnd: string
  responsible: any
  auditReason: string
  result: TAppointsResult[]
  allStats: TAllStats
  resultDocs: {
    xl_href: string
    csv_href: string
    pdf_report: string
  }
}