import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export async function getSecret(secretName: string, isProduction: boolean): Promise<string> {
    /**
     * Fetch a secret from Google Secret Manager using a service account key file locally
     * or the default service account in Cloud Run.
     */

    try {
        // Modify secret name based on environment
        if (isProduction) {
            secretName += "_PRODUCTION";
        } else {
            secretName += "_LOCAL";
        }

        // Access Google Secret Manager
        const client = new SecretManagerServiceClient();

        // Get the project ID from the environment variable
        const projectId = process.env.GOOGLE_CLOUD_PROJECT;
        if (!projectId) {
            throw new Error('GOOGLE_CLOUD_PROJECT environment variable is not set.');
        }

        // Build the resource name of the secret
        const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;

        // Access the secret version
        const [version] = await client.accessSecretVersion({ name });

        if (!version.payload?.data) {
            throw new Error('Secret payload data is missing.');
        }

        // Return the secret payload as a string
        const secret = version.payload.data.toString();
        return secret;

    } catch (error) {
        // Type narrowing for safe access to properties like 'code'
        if (error instanceof Error && 'code' in error) {
            const errorCode = (error as { code?: number }).code;
            if (errorCode === 16) {  // Unauthorized error code
                throw new Error('Failed to access Google Secret Manager: ensure your credentials are set correctly.');
            }
        }

        if (error instanceof Error) {
            throw new Error(`An error occurred while accessing the secret '${secretName}' from Google Secret Manager: ${error.message}`);
        }

        throw new Error('An unknown error occurred.');
    }
}
