{{/*
Expand the name of the chart.
*/}}
{{- define "automation-service.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "automation-service.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name (include "automation-service.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Chart label (name + version).
*/}}
{{- define "automation-service.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels applied to every resource.
*/}}
{{- define "automation-service.labels" -}}
helm.sh/chart: {{ include "automation-service.chart" . }}
app.kubernetes.io/name: {{ include "automation-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Values.image.tag | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
env: {{ .Values.env.TEST_ENV }}
{{- end }}

{{/*
Selector labels used by Deployment, Service, HPA, and PDB.
*/}}
{{- define "automation-service.selectorLabels" -}}
app.kubernetes.io/name: {{ include "automation-service.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
env: {{ .Values.env.TEST_ENV }}
{{- end }}

{{/*
ServiceAccount name to use.
*/}}
{{- define "automation-service.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "automation-service.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
