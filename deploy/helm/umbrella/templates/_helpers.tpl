{{- define "predator-umbrella.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "predator-umbrella.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- $fullname := printf "%s-%s" .Release.Name $name -}}
{{- $fullname | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "predator-umbrella.labels" -}}
helm.sh/chart: {{ include "predator-umbrella.name" . }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/name: {{ include "predator-umbrella.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}
